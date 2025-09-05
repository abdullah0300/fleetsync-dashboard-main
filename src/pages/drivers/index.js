// ** React Imports
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'

// ** Third-Party
import axios from 'axios'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

// Custom styled components based on FleetSeek branding
const FleetSeekButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e63946',
  color: '#ffffff',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#c62b37',
    boxShadow: '0 8px 15px rgba(230, 57, 70, 0.2)'
  }
}))

const FleetSeekCard = styled(Card)(({ theme }) => ({
  borderRadius: '0.75rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden'
}))

const FleetSeekCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: '#f1faee',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  '& .MuiCardHeader-title': {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1d3557'
  }
}))

const FleetSeekTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    '&:hover fieldset': {
      borderColor: '#457b9d'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e63946'
    }
  }
}))

const FleetSeekSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#457b9d'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e63946'
  }
}))

const DriverDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const DriverDetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  maxWidth: 550,
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto'
}))

const DetailLabel = styled(Typography)(({ theme }) => ({
  color: '#457b9d',
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5)
}))

const DetailValue = styled(Typography)(({ theme }) => ({
  color: '#1d3557',
  fontSize: '1rem'
}))

const DetailChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  backgroundColor: color === 'primary' ? 'rgba(230, 57, 70, 0.1)' : 'rgba(69, 123, 157, 0.1)',
  color: color === 'primary' ? '#e63946' : '#457b9d'
}))

const DriverAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  color: '#e63946',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}))

// ** Avatar Renderer
const renderDriverAvatar = (firstName, lastName) => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim()
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['#e63946', '#457b9d', '#1d3557', '#a8dadc', '#f1faee', '#2A2A2A']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      sx={{
        mr: 3,
        fontSize: '.8rem',
        width: 30,
        height: 30,
        backgroundColor: `${color}20`,
        color: color
      }}
    >
      {getInitials(fullName || 'Driver')}
    </CustomAvatar>
  )
}

const DriversList = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [driverTypeFilter, setDriverTypeFilter] = useState('')
  const [availableDriverTypes] = useState(['Full-Time', 'Part-Time']) // Static list of driver types
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [managers, setManagers] = useState([])

  const fetchDrivers = async (type = '') => {
    try {
      const token = window.localStorage.getItem('token')
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/drivers`

      const response = await axios.get(type ? `${url}?driverType=${type}` : url, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const drivers = response.data.data
      setRows(drivers)
    } catch (err) {
      console.error('Failed to fetch drivers:', err)
    }
  }

  const fetchManagers = async () => {
    try {
      const token = window.localStorage.getItem('token')

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setManagers(response.data.data.filter(u => u.role === 'Manager'))
    } catch (err) {
      console.error('Failed to fetch managers:', err)
    }
  }

  useEffect(() => {
    fetchDrivers()
    fetchManagers()
  }, [])

  useEffect(() => {
    if (driverTypeFilter) {
      fetchDrivers(driverTypeFilter)
    } else {
      fetchDrivers()
    }
  }, [driverTypeFilter])

  const handleDeleteConfirmation = (e, id) => {
    e.stopPropagation()
    setSelectedDriverId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    const token = window.localStorage.getItem('token')
    await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/drivers/${selectedDriverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRows(prev => prev.filter(row => row._id !== selectedDriverId))
    setDeleteDialogOpen(false)
    setSelectedDriverId(null)
  }

  const handleRowClick = params => {
    setSelectedDriver(params.row)
    setDetailModalOpen(true)
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    router.push(`/drivers/form/${id}`)
  }

  const filteredRows = rows.filter(row => {
    const fullName = `${row.userId?.fullName?.firstName || ''} ${row.userId?.fullName?.lastName || ''}`.toLowerCase()
    const email = row.userId?.email?.toLowerCase() || ''
    const query = searchValue.toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })

  const getManagerName = managerId => {
    if (!managerId) return 'N/A'
    const manager = managers.find(m => m._id === managerId._id)
    
return manager
      ? `${manager.fullName?.firstName || ''} ${manager.fullName?.lastName || ''}`.trim()
      : 'Unknown Manager'
  }

  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    
return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{ fileName: 'drivers-report' }}
          excelOptions={{ fileName: 'drivers-report' }}
        />
      </GridToolbarContainer>
    )
  }

  const columns = [
    {
      field: 'user',
      headerName: 'Driver',
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const fullName =
          `${params.row.userId?.fullName?.firstName || ''} ${params.row.userId?.fullName?.lastName || ''}`.trim() ||
          'N/A'
        
return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderDriverAvatar(params.row.userId?.fullName?.firstName, params.row.userId?.fullName?.lastName)}
            <Typography variant='body2'>{fullName}</Typography>
          </Box>
        )
      },
      valueGetter: params =>
        params.row?.userId
          ? `${params.row?.userId?.fullName?.firstName} ${params.row?.userId?.fullName?.lastName}`
          : 'N/A',
      getExportValue: params =>
        params.row?.userId
          ? `${params.row?.userId?.fullName?.lastName} ${params.row?.userId?.fullName?.lastName}`
          : 'N/A'
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: params => <Typography variant='body2'>{params.row.userId?.email || 'N/A'}</Typography>,
      valueGetter: params => params.row.userId?.email || 'N/A',
      getExportValue: params => params.row.userId?.email || 'N/A'
    },
    {
      field: 'driverType',
      headerName: 'Driver Type',
      flex: 0.7,
      minWidth: 130,
      renderCell: params => <DetailChip label={params.row.driverType || 'N/A'} color='primary' size='small' />
    },
    {
      field: 'driverLicenseNumber',
      headerName: 'License No.',
      flex: 0.7,
      minWidth: 130,
      renderCell: params => <Typography variant='body2'>{params.row.driverLicense?.number || 'N/A'}</Typography>,
      valueGetter: params => params.row.driverLicense?.number || 'N/A',
      getExportValue: params => params.row.driverLicense?.number || 'N/A'
    },
    {
      field: 'licenseState',
      headerName: 'State',
      flex: 0.5,
      minWidth: 100,
      renderCell: params => <Typography variant='body2'>{params.row.driverLicense?.state || 'N/A'}</Typography>,
      valueGetter: params => params.row.driverLicense?.state || 'N/A',
      getExportValue: params => params.row.driverLicense?.state || 'N/A'
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.7,
      minWidth: 130,
      renderCell: params => {
        const date = params.row.startDate ? new Date(params.row.startDate) : null
        
return <Typography variant='body2'>{date ? date.toLocaleDateString() : 'N/A'}</Typography>
      },
      valueGetter: params => {
        const date = params.row.startDate ? new Date(params.row.startDate) : null
        
return date ? date.toLocaleDateString() : 'N/A'
      },
      getExportValue: params => {
        const date = params.row.startDate ? new Date(params.row.startDate) : null
        
return date ? date.toLocaleDateString() : 'N/A'
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 120,
      renderCell: ({ row }) => (
        <>
          <IconButton sx={{ color: '#457b9d' }} onClick={e => handleEdit(e, row._id)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton sx={{ color: '#e63946' }} onClick={e => handleDeleteConfirmation(e, row._id)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      ),
      disableExport: true
    }
  ]

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader
        title='Drivers'
        action={
          <FleetSeekButton
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => router.push('/drivers/form')}
          >
            Add Driver
          </FleetSeekButton>
        }
      />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FleetSeekTextField
              fullWidth
              placeholder='Search by name or email...'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:search' />
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='driverType-filter-label' sx={{ color: '#457b9d' }}>
                Driver Type
              </InputLabel>
              <FleetSeekSelect
                labelId='driverType-filter-label'
                value={driverTypeFilter}
                label='Driver Type'
                onChange={e => setDriverTypeFilter(e.target.value)}
              >
                <MenuItem value=''>All Driver Types</MenuItem>
                {availableDriverTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </FleetSeekSelect>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <DataGrid
        autoHeight
        getRowId={row => row._id}
        rows={filteredRows}
        columns={columns}
        pagination
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          }
        }}
        components={{ Toolbar: CustomToolbar }}
        slotProps={{
          baseButton: {
            size: 'large',
            variant: 'tonal'
          }
        }}
        onRowClick={handleRowClick}
        sx={{
          border: 'none',
          px: 3,
          pb: 3,
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(168, 218, 220, 0.1)'
            }
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(29, 53, 87, 0.05)',
            borderRadius: '8px',
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              color: '#1d3557'
            }
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ color: '#1d3557', fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#2A2A2A' }}>
            Are you sure you want to delete this driver? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#457b9d' }}>
            Cancel
          </Button>
          <FleetSeekButton onClick={handleDelete}>Delete</FleetSeekButton>
        </DialogActions>
      </Dialog>

      {/* Driver Detail Modal */}
      <DriverDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='driver-detail-modal'
      >
        <DriverDetailPaper>
          {selectedDriver && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <DriverAvatar>
                  {getInitials(
                    `${selectedDriver.userId?.fullName?.firstName || ''} ${
                      selectedDriver.userId?.fullName?.lastName || ''
                    }`.trim() || 'Driver'
                  )}
                </DriverAvatar>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {`${selectedDriver.userId?.fullName?.firstName || ''} ${
                    selectedDriver.userId?.fullName?.lastName || ''
                  }`.trim() || 'Driver'}
                </Typography>
                <DetailChip label={selectedDriver.driverType || 'N/A'} color='primary' sx={{ mb: 1 }} />
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ backgroundColor: 'rgba(241, 250, 238, 0.5)', p: 3, borderRadius: '12px', mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DetailLabel>Driver Information</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <DetailLabel>Driver Type</DetailLabel>
                        <DetailValue>
                          <DetailChip label={selectedDriver.driverType || 'N/A'} color='primary' size='small' />
                        </DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Start Date</DetailLabel>
                        <DetailValue>{formatDate(selectedDriver.startDate)}</DetailValue>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>License Information</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <DetailLabel>License Number</DetailLabel>
                        <DetailValue>{selectedDriver.driverLicense?.number || 'N/A'}</DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>License State</DetailLabel>
                        <DetailValue>{selectedDriver.driverLicense?.state || 'N/A'}</DetailValue>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Manager</DetailLabel>
                    <DetailValue>{getManagerName(selectedDriver.managedByManagerId)}</DetailValue>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant='outlined'
                  onClick={() => setDetailModalOpen(false)}
                  sx={{
                    borderColor: '#457b9d',
                    color: '#457b9d',
                    '&:hover': {
                      borderColor: '#1d3557',
                      backgroundColor: 'rgba(29, 53, 87, 0.05)'
                    }
                  }}
                >
                  Close
                </Button>
                <FleetSeekButton
                  variant='contained'
                  startIcon={<Icon icon='tabler:edit' />}
                  onClick={() => {
                    setDetailModalOpen(false)
                    router.push(`/drivers/form/${selectedDriver._id}`)
                  }}
                >
                  Edit Driver
                </FleetSeekButton>
              </Box>
            </>
          )}
        </DriverDetailPaper>
      </DriverDetailModal>
    </FleetSeekCard>
  )
}

export default DriversList

DriversList.acl = {
  action: 'read',
  subject: 'drivers-page'
}
