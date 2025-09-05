// ** React Imports
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

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

const UserDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const UserDetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  maxWidth: 800,
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto'
}))

const DetailSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
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
      : color === 'danger'
      ? 'rgba(230, 57, 70, 0.1)'
      : color === 'primary'
      ? 'rgba(230, 57, 70, 0.1)'
      : 'rgba(69, 123, 157, 0.1)',
  color: color === 'success' ? '#2ecc71' : color === 'danger' ? '#e63946' : color === 'primary' ? '#e63946' : '#457b9d'
}))

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  color: '#e63946',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}))

// ** Avatar Renderer
const renderUserAvatar = (firstName, lastName) => {
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
      {getInitials(fullName || 'User')}
    </CustomAvatar>
  )
}

const UsersList = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [companies, setCompanies] = useState([])

  const [roleFilter, setRoleFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const ability = useContext(AbilityContext)

  const fetchUsers = async () => {
    const token = window.localStorage.getItem('token')
    const params = {}

    if (roleFilter) params.role = roleFilter
    if (companyFilter) params.companyId = companyFilter
    if (statusFilter) params.isActive = statusFilter === 'active'

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })

    setRows(response.data.data)
  }

  const fetchCompanies = async () => {
    const token = window.localStorage.getItem('token')

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setCompanies(response.data.data)
  }

  const filteredRows = rows.filter(row => {
    const fullName = `${row.fullName?.firstName || ''} ${row.fullName?.lastName || ''}`.toLowerCase()
    const email = row.email?.toLowerCase() || ''
    const query = searchValue.toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, companyFilter, statusFilter])

  useEffect(() => {
    console.log(ability)
    if (ability?.can('manage', 'all')) {
      fetchCompanies()
    }
  }, [])

  const handleDeleteConfirmation = (e, id) => {
    e.stopPropagation()
    setSelectedUserId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    const token = window.localStorage.getItem('token')
    await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRows(prev => prev.filter(row => row._id !== selectedUserId))
    setDeleteDialogOpen(false)
    setSelectedUserId(null)
  }

  const handleRowClick = params => {
    setSelectedUser(params.row)
    setDetailModalOpen(true)
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    router.push(`/users/form/${id}`)
  }

  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    
return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getCompanyName = companyId => {
    console.log(companyId)
    if (!companyId) return 'N/A'

    // const company = companies.find(c => c._id === companyId)
    return companyId.companyName ? companyId.companyName : 'Unknown Company'
  }

  const getRoleColor = role => {
    switch (role) {
      case 'SuperAdmin':
        return 'primary'
      case 'Manager':
        return 'secondary'
      case 'Driver':
        return 'info'
      default:
        return 'default'
    }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{ fileName: 'users-report' }}
          excelOptions={{ fileName: 'users-report' }}
        />
      </GridToolbarContainer>
    )
  }

  let columns = [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      minWidth: 220,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderUserAvatar(params.row.fullName?.firstName, params.row.fullName?.lastName)}
          <Typography variant='body2'>
            {`${params.row.fullName?.firstName || ''} ${params.row.fullName?.lastName || ''}`.trim() || 'N/A'}
          </Typography>
        </Box>
      ),
      valueGetter: params => `${params.row.fullName?.firstName} ${params.row.fullName?.lastName}`,
      getExportValue: params => `${params.row.fullName?.lastName} ${params.row.fullName?.lastName}`
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 220
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.7,
      minWidth: 120,
      renderCell: params => (
        <DetailChip label={params.row.role || 'N/A'} color={getRoleColor(params.row.role)} size='small' />
      )
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      minWidth: 180,
      renderCell: params => <Typography variant='body2'>{getCompanyName(params.row.companyId)}</Typography>,
      valueGetter: params => getCompanyName(params.row.companyId) || 'N/A',
      getExportValue: params => getCompanyName(params.row.companyId) || 'N/A'
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: params => {
        return (
          <DetailChip
            label={params.row.isActive ? 'Active' : 'Inactive'}
            color={params.row.isActive ? 'success' : 'danger'}
            size='small'
          />
        )
      },
      valueGetter: params => (params.row.isActive ? 'Active' : 'Inactive'),
      getExportValue: params => (params.row.isActive ? 'Active' : 'Inactive')
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

  // Remove 'role' and 'company' if permission is false
  if (!ability?.can('manage', 'all')) {
    columns = columns.filter(col => col.field !== 'role' && col.field !== 'company')
  }

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader
        title='Users'
        action={
          <FleetSeekButton
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => router.push('/users/form')}
          >
            Add User
          </FleetSeekButton>
        }
      />

      {/* Filters */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
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
          {ability?.can('manage', 'all') && (
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id='role-filter-label' sx={{ color: '#457b9d' }}>
                  Role
                </InputLabel>
                <FleetSeekSelect
                  labelId='role-filter-label'
                  value={roleFilter}
                  label='Role'
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <MenuItem value=''>All Roles</MenuItem>
                  <MenuItem value='SuperAdmin'>SuperAdmin</MenuItem>
                  <MenuItem value='Manager'>Manager</MenuItem>
                  <MenuItem value='Driver'>Driver</MenuItem>
                </FleetSeekSelect>
              </FormControl>
            </Grid>
          )}
          {ability?.can('manage', 'all') && (
            <Grid item xs={12} md={3}>
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
                  {companies.map(company => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.companyName || company._id}
                    </MenuItem>
                  ))}
                </FleetSeekSelect>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} md={3}>
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

      {/* User List */}
      <DataGrid
        autoHeight
        getRowId={row => row._id}
        rows={filteredRows}
        columns={columns}
        components={{ Toolbar: CustomToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          }
        }}
        pagination
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
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
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#457b9d' }}>
            Cancel
          </Button>
          <FleetSeekButton onClick={handleDelete}>Delete</FleetSeekButton>
        </DialogActions>
      </Dialog>

      {/* User Detail Modal */}
      <UserDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='user-detail-modal'
      >
        <UserDetailPaper sx={{ maxWidth: 500 }}>
          {selectedUser && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <UserAvatar>
                  {getInitials(
                    `${selectedUser.fullName?.firstName || ''} ${selectedUser.fullName?.lastName || ''}`.trim() ||
                      'User'
                  )}
                </UserAvatar>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {`${selectedUser.fullName?.firstName || ''} ${selectedUser.fullName?.lastName || ''}`.trim() ||
                    'User'}
                </Typography>
                <DetailChip
                  label={selectedUser.isActive ? 'Active' : 'Inactive'}
                  color={selectedUser.isActive ? 'success' : 'danger'}
                />
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ backgroundColor: 'rgba(241, 250, 238, 0.5)', p: 3, borderRadius: '12px', mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedUser.email || 'N/A'}</DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>
                      <DetailChip label={selectedUser.role || 'N/A'} color={getRoleColor(selectedUser.role)} />
                    </DetailValue>
                  </Grid>

                  <Grid item xs={12}>
                    <DetailLabel>Company</DetailLabel>
                    <DetailValue>{getCompanyName(selectedUser.companyId)}</DetailValue>
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
                    router.push(`/users/form/${selectedUser._id}`)
                  }}
                >
                  Edit User
                </FleetSeekButton>
              </Box>
            </>
          )}
        </UserDetailPaper>
      </UserDetailModal>
    </FleetSeekCard>
  )
}

export default UsersList

UsersList.acl = {
  action: 'read',
  subject: 'users-page'
}
