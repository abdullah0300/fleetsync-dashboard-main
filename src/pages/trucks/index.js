import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

// ** MUI
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

// ** Custom
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { AbilityContext } from 'src/layouts/components/acl/Can'

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

const TruckDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const TruckDetailPaper = styled(Paper)(({ theme }) => ({
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
  backgroundColor:
    color === 'success'
      ? 'rgba(46, 204, 113, 0.1)'
      : color === 'error'
      ? 'rgba(230, 57, 70, 0.1)'
      : color === 'primary'
      ? 'rgba(230, 57, 70, 0.1)'
      : 'rgba(69, 123, 157, 0.1)',
  color: color === 'success' ? '#2ecc71' : color === 'error' ? '#e63946' : color === 'primary' ? '#e63946' : '#457b9d'
}))

const TruckAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  color: '#e63946',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}))

const renderTruckAvatar = model => {
  const states = ['#e63946', '#457b9d', '#1d3557', '#a8dadc', '#f1faee', '#2A2A2A']
  const color = states[Math.floor(Math.random() * 6)]
  
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
      {getInitials(model || 'T')}
    </CustomAvatar>
  )
}

const TrucksList = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTruckId, setSelectedTruckId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(null)

  const [companyFilter, setCompanyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [companiesList, setCompaniesList] = useState([])
  const ability = useContext(AbilityContext)

  useEffect(() => {
    const fetchTrucks = async () => {
      const token = window.localStorage.getItem('token')
      try {
        const params = {}

        if (companyFilter) params.companyId = companyFilter
        if (statusFilter) params.isActive = statusFilter === 'active'

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        })
        const trucks = response.data.data
        setRows(trucks)
      } catch (error) {
        console.error('Error fetching trucks:', error)
      }
    }

    fetchTrucks()
  }, [statusFilter, companyFilter])

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = window.localStorage.getItem('token')

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompaniesList(response.data.data)
    }
    if (ability?.can('manage', 'all')) {
      fetchCompanies()
    }
  }, [])

  const handleDeleteConfirmation = (e, id) => {
    e.stopPropagation()
    setSelectedTruckId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    const token = window.localStorage.getItem('token')
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks/${selectedTruckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRows(prev => prev.filter(row => row._id !== selectedTruckId))
    } catch (error) {
      console.error('Error deleting truck:', error)
    } finally {
      setDeleteDialogOpen(false)
      setSelectedTruckId(null)
    }
  }

  const handleRowClick = params => {
    setSelectedTruck(params.row)
    setDetailModalOpen(true)
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    router.push(`/trucks/form/${id}`)
  }

  const filteredRows = rows.filter(row => {
    const query = searchValue.toLowerCase()
    const vin = row.vin?.toLowerCase() || ''
    const model = row.model?.toLowerCase() || ''
    const regNumber = row.regNumber?.toLowerCase() || ''

    return vin.includes(query) || model.includes(query) || regNumber.includes(query)
  })

  const getDriverNames = assignedDrivers => {
    if (!assignedDrivers) return { main: 'N/A', co: 'N/A' }

    const mainDriver = assignedDrivers.mainDriver?.driverId
      ? `${assignedDrivers.mainDriver?.driverId?.fullName?.firstName || ''} ${
          assignedDrivers.mainDriver?.driverId?.fullName?.lastName || ''
        }`.trim()
      : 'N/A'

    const coDriver = assignedDrivers.coDriver?.driverId
      ? `${assignedDrivers.coDriver?.driverId?.fullName?.firstName || ''} ${
          assignedDrivers.coDriver?.driverId?.fullName?.lastName || ''
        }`.trim()
      : 'N/A'

    return { main: mainDriver, co: coDriver }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }}   csvOptions={{ fileName: 'trucks-report' }}
  excelOptions={{ fileName: 'trucks-report' }}
 />
      </GridToolbarContainer>
    );
  }

  let columns = [
    {
      field: 'model',
      headerName: 'Model',
      flex: 1,
      minWidth: 180,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderTruckAvatar(params.row.model)}
          <Typography variant='body2'>{params.row.model || 'N/A'}</Typography>
        </Box>
      )
    },
    {
      field: 'vin',
      headerName: 'VIN',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'regNumber',
      headerName: 'Reg Number',
      flex: 0.8,
      minWidth: 150
    },
    {
      field: 'truckType',
      headerName: 'Truck Type',
      flex: 0.7,
      minWidth: 120,
      renderCell: params => <DetailChip label={params.row.truckType || 'N/A'} color='primary' size='small' />
    },
    {
      field: 'companyId',
      headerName: 'Company',
      flex: 0.8,
      minWidth: 150,
      renderCell: params => <Typography variant='body2'>{params.row.companyId?.companyName || 'N/A'}</Typography>,
      valueGetter: params => params.row.companyId?.companyName || 'N/A',
      getExportValue: params => params.row.companyId?.companyName || 'N/A',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      minWidth: 100,
      renderCell: params => (
        <DetailChip
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'error'}
          size='small'
        />
      ),
      valueGetter: params => params.row.isActive ? 'Active' : 'Inactive',
      getExportValue: params => params.row.isActive ? 'Active' : 'Inactive',
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

  if (!ability?.can('manage', 'all')) {
    columns = columns.filter(col => col.field !== 'companyId')
  }

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader
        title='Trucks'
        action={
          <FleetSeekButton
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => router.push('/trucks/form')}
          >
            Add Truck
          </FleetSeekButton>
        }
      />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FleetSeekTextField
              fullWidth
              placeholder='Search by VIN, Model, or Reg Number...'
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
          {ability?.can('manage', 'all') && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='company-filter-label' sx={{ color: '#457b9d' }}>
                  Company
                </InputLabel>
                <FleetSeekSelect
                  labelId='company-filter-label'
                  value={companyFilter}
                  label='Company'
                  onChange={e => setCompanyFilter(e.target.value)}
                >
                  <MenuItem value=''>All Companies</MenuItem>
                  {companiesList.map(company => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </FleetSeekSelect>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id='status-filter-label' sx={{ color: '#457b9d' }}>
                Status
              </InputLabel>
              <FleetSeekSelect
                labelId='status-filter-label'
                value={statusFilter}
                label='Status'
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value=''>All Status</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
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
            variant: 'tonal',
          },
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
            Are you sure you want to delete this truck? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#457b9d' }}>
            Cancel
          </Button>
          <FleetSeekButton onClick={handleDelete}>Delete</FleetSeekButton>
        </DialogActions>
      </Dialog>

      {/* Truck Detail Modal */}
      <TruckDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='truck-detail-modal'
      >
        <TruckDetailPaper>
          {selectedTruck && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <TruckAvatar>{getInitials(selectedTruck.model || 'T')}</TruckAvatar>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {selectedTruck.model || 'Truck'}
                </Typography>
                <DetailChip
                  label={selectedTruck.isActive ? 'Active' : 'Inactive'}
                  color={selectedTruck.isActive ? 'success' : 'error'}
                />
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ backgroundColor: 'rgba(241, 250, 238, 0.5)', p: 3, borderRadius: '12px', mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DetailLabel>Truck Information</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <DetailLabel>VIN</DetailLabel>
                        <DetailValue>{selectedTruck.vin || 'N/A'}</DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Registration Number</DetailLabel>
                        <DetailValue>{selectedTruck.regNumber || 'N/A'}</DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Truck Type</DetailLabel>
                        <DetailValue>
                          <DetailChip label={selectedTruck.truckType || 'N/A'} color='primary' size='small' />
                        </DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Trailer Type</DetailLabel>
                        <DetailValue>{selectedTruck.trailerType || 'N/A'}</DetailValue>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Company</DetailLabel>
                    <DetailValue>{selectedTruck.companyId?.companyName || 'N/A'}</DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Assigned Drivers</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <DetailLabel>Main Driver</DetailLabel>
                        <DetailValue>
                          {selectedTruck.assignedDrivers?.mainDriver?.driverId
                            ? `${selectedTruck.assignedDrivers?.mainDriver?.driverId?.fullName?.firstName || ''} ${
                                selectedTruck.assignedDrivers?.mainDriver?.driverId?.fullName?.lastName || ''
                              }`.trim()
                            : 'Unassigned'}
                        </DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Co-Driver</DetailLabel>
                        <DetailValue>
                          {selectedTruck.assignedDrivers?.coDriver?.driverId
                            ? `${selectedTruck.assignedDrivers?.coDriver?.driverId?.fullName?.firstName || ''} ${
                                selectedTruck.assignedDrivers?.coDriver?.driverId?.fullName?.lastName || ''
                              }`.trim()
                            : 'Unassigned'}
                        </DetailValue>
                      </Grid>
                    </Grid>
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
                    router.push(`/trucks/form/${selectedTruck._id}`)
                  }}
                >
                  Edit Truck
                </FleetSeekButton>
              </Box>
            </>
          )}
        </TruckDetailPaper>
      </TruckDetailModal>
    </FleetSeekCard>
  )
}

export default TrucksList

TrucksList.acl = {
  action: 'read',
  subject: 'trucks-edit'
}
