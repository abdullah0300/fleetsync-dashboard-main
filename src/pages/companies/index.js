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
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
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

const CompanyDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const CompanyDetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  maxWidth: 500,
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

const CompanyAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  color: '#e63946',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}))

// ** Avatar Renderer
const renderCompanyAvatar = name => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['#e63946', '#457b9d', '#1d3557', '#a8dadc', '#f1faee', '#2A2A2A']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      sx={{ mr: 3, fontSize: '.8rem', width: 30, height: 30, backgroundColor: `${color}20`, color: color }}
    >
      {getInitials(name)}
    </CustomAvatar>
  )
}

const CompaniesList = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = window.localStorage.getItem('token')

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRows(response.data.data)
    }

    fetchCompanies()
  }, [])

  const handleDeleteConfirmation = (event, id) => {
    event.stopPropagation()
    setSelectedCompanyId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    const token = window.localStorage.getItem('token')
    await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies/${selectedCompanyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRows(prev => prev.filter(row => row._id !== selectedCompanyId))
    setDeleteDialogOpen(false)
    setSelectedCompanyId(null)
  }

  const handleRowClick = params => {
    setSelectedCompany(params.row)
    setDetailModalOpen(true)
  }

  const handleEdit = (event, id) => {
    event.stopPropagation()
    router.push(`/companies/form/${id}`)
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }}   csvOptions={{ fileName: 'companies-report' }}
  excelOptions={{ fileName: 'comapnies-report' }}
 />
      </GridToolbarContainer>
    );
  }

  const columns = [
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 1,
      minWidth: 250,
      renderCell: params => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderCompanyAvatar(params.row.companyName)}
          <Typography variant='body2'>{params.row.companyName}</Typography>
        </div>
      )
    },
    {
      field: 'contactEmail',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: params => <Typography variant='body2'>{params.row.contactEmail}</Typography>
    },
    {
      field: 'contactPhone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 150,
      renderCell: params => <Typography variant='body2'>{params.row.contactPhone}</Typography>
    },
    {
      field: 'truckQuota',
      headerName: 'Truck Quota',
      flex: 0.5,
      minWidth: 100,
      renderCell: params => <DetailChip label={params.row.truckQuota} color='primary' size='small' />
    },
    {
      field: 'planType',
      headerName: 'Plan Type',
      flex: 0.5,
      minWidth: 120,
      valueGetter: params => params.row.paymentArrangement?.planType || 'N/A',
      getExportValue: params => params.row.paymentArrangement?.planType || 'N/A',
      renderCell: params => (
        <DetailChip label={params.row.paymentArrangement?.planType || 'N/A'} color='secondary' size='small' />
      )
    },
    {
      field: 'billingCycle',
      headerName: 'Billing Cycle',
      flex: 0.5,
      minWidth: 120,
      valueGetter: params => params.row.paymentArrangement?.billingCycle || 'N/A',
      getExportValue: params => params.row.paymentArrangement?.billingCycle || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 150,
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

  const filteredRows = rows.filter(
    row =>
      (row.companyName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
      (row.contactEmail || '').toLowerCase().includes(searchValue.toLowerCase()) ||
      (row.contactPhone || '').toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader
        title='Companies'
        action={
          <FleetSeekButton
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => router.push('/companies/form')}
          >
            Add Company
          </FleetSeekButton>
        }
      />
      <Box sx={{ p: 3, pb: 0 }}>
        <TextField
          fullWidth
          placeholder='Search company by name, email or phone...'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='tabler:search' />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#457b9d'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e63946'
              }
            }
          }}
        />
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
          p: 3,
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
            Are you sure you want to delete this company? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#457b9d' }}>
            Cancel
          </Button>
          <FleetSeekButton onClick={handleDelete}>Delete</FleetSeekButton>
        </DialogActions>
      </Dialog>

      {/* Company Detail Modal */}
      <CompanyDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='company-detail-modal'
      >
        <CompanyDetailPaper>
          {selectedCompany && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <CompanyAvatar>{getInitials(selectedCompany.companyName)}</CompanyAvatar>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {selectedCompany.companyName}
                </Typography>
                <DetailChip label={selectedCompany.paymentArrangement?.planType || 'N/A'} color='primary' />
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ backgroundColor: 'rgba(241, 250, 238, 0.5)', p: 3, borderRadius: '12px', mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedCompany.contactEmail || 'N/A'}</DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{selectedCompany.contactPhone || 'N/A'}</DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Truck Quota</DetailLabel>
                    <DetailValue>
                      <DetailChip label={selectedCompany.truckQuota || '0'} color='primary' size='small' />
                    </DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Payment Plan</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <DetailLabel>Plan Type</DetailLabel>
                        <DetailValue>{selectedCompany.paymentArrangement?.planType || 'N/A'}</DetailValue>
                      </Grid>
                      <Grid item xs={6}>
                        <DetailLabel>Billing Cycle</DetailLabel>
                        <DetailValue>{selectedCompany.paymentArrangement?.billingCycle || 'N/A'}</DetailValue>
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
                    router.push(`/companies/form/${selectedCompany._id}`)
                  }}
                >
                  Edit Company
                </FleetSeekButton>
              </Box>
            </>
          )}
        </CompanyDetailPaper>
      </CompanyDetailModal>
    </FleetSeekCard>
  )
}

CompaniesList.acl = {
  action: 'read',
  subject: 'companies-page'
}

export default CompaniesList
