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
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'

// ** Third-Party
import axios from 'axios'

// ** Custom Components
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

const TripFormDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const TripFormDetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  maxWidth: '90%',
  width: '900px',
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

const FormAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(230, 57, 70, 0.1)',
  color: '#e63946',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2)
}))

const DetailChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  backgroundColor: color === 'primary' ? 'rgba(230, 57, 70, 0.1)' : 'rgba(69, 123, 157, 0.1)',
  color: color === 'primary' ? '#e63946' : '#457b9d'
}))

const FleetSeekTableHead = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(29, 53, 87, 0.05)',
  color: '#1d3557',
  fontWeight: 700,
  fontSize: '0.875rem'
}))

const FleetSeekTableRow = styled(TableRow)(({ theme, isEven }) => ({
  '&:hover': {
    backgroundColor: 'rgba(168, 218, 220, 0.1)'
  },
  backgroundColor: isEven ? 'rgba(241, 250, 238, 0.5)' : 'transparent'
}))

const TripFormsList = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)
  const ability = useContext(AbilityContext)

  useEffect(() => {
    const fetchForms = async () => {
      const token = window.localStorage.getItem('token')

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripforms`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRows(response.data.data)
    }

    fetchForms()
  }, [])

  const handleDeleteConfirmation = (e, id) => {
    e.stopPropagation()
    setSelectedFormId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    const token = window.localStorage.getItem('token')
    await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripforms/${selectedFormId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRows(prev => prev.filter(row => row._id !== selectedFormId))
    setDeleteDialogOpen(false)
    setSelectedFormId(null)
  }

  const handleRowClick = params => {
    setSelectedForm(params.row)
    setDetailModalOpen(true)
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    router.push(`/tripForms/form/${id}`)
  }

  const filteredRows = rows.filter(row => row.formName.toLowerCase().includes(searchValue.toLowerCase()))

  const getQuestionTypeLabel = type => {
    switch (type) {
      case 'text':
        return 'Text Input'
      case 'number':
        return 'Number Input'
      case 'select':
        return 'Dropdown'
      case 'radio':
        return 'Radio Buttons'
      case 'checkbox':
        return 'Checkboxes'
      case 'textarea':
        return 'Text Area'
      case 'date':
        return 'Date Input'
      case 'time':
        return 'Time Input'
      default:
        return type || 'Unknown'
    }
  }

  const getManagerName = manager => {
    if (!manager) return 'N/A'
    
return (
      `${manager.fullName?.firstName || ''} ${manager.fullName?.lastName || ''}`.trim() || manager.email || 'Unknown'
    )
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{ fileName: 'forms-report' }}
          excelOptions={{ fileName: 'forms-report' }}
        />
      </GridToolbarContainer>
    )
  }

  let columns = [
    {
      field: 'formName',
      headerName: 'Form Name',
      flex: 1,
      minWidth: 220,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              mr: 3,
              width: 30,
              height: 30,
              bgcolor: 'rgba(230, 57, 70, 0.1)',
              color: '#e63946',
              fontSize: '.8rem'
            }}
          >
            {getInitials(params.row.formName || 'F')}
          </Avatar>
          <Typography variant='body2'>{params.row.formName}</Typography>
        </Box>
      )
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const manager = params.row.managerId
        
return <Typography variant='body2'>{manager ? getManagerName(manager) : 'N/A'}</Typography>
      },
      valueGetter: params => {
        const manager = params.row.managerId
        
return manager ? getManagerName(manager) : 'N/A'
      },
      getExportValue: params => {
        const manager = params.row.managerId
        
return manager ? getManagerName(manager) : 'N/A'
      }
    },
    {
      field: 'questionsCount',
      headerName: 'No of Questions',
      flex: 0.5,
      minWidth: 120,
      renderCell: params => <DetailChip label={params.row.questions?.length || 0} color='primary' size='small' />,
      valueGetter: params => params.row.questions?.length || 0,
      getExportValue: params => params.row.questions?.length || 0
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 120,
      disableExport: true,
      renderCell: ({ row }) => (
        <>
          <IconButton sx={{ color: '#457b9d' }} onClick={e => handleEdit(e, row._id)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton sx={{ color: '#e63946' }} onClick={e => handleDeleteConfirmation(e, row._id)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      )
    }
  ]

  if (!ability?.can('manage', 'all')) {
    columns = columns.filter(col => col.field !== 'manager')
  }

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader
        title='Trip Forms'
        action={
          <FleetSeekButton
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={() => router.push('/tripForms/form')}
          >
            Add Form
          </FleetSeekButton>
        }
      />

      <Box sx={{ p: 3 }}>
        <FleetSeekTextField
          fullWidth
          placeholder='Search by form name...'
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
            size: 'medium',
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
            Are you sure you want to delete this form? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#457b9d' }}>
            Cancel
          </Button>
          <FleetSeekButton onClick={handleDelete}>Delete</FleetSeekButton>
        </DialogActions>
      </Dialog>

      {/* Trip Form Detail Modal */}
      <TripFormDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='trip-form-detail-modal'
      >
        <TripFormDetailPaper>
          {selectedForm && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <FormAvatar>{getInitials(selectedForm.formName || 'F')}</FormAvatar>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {selectedForm.formName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DetailChip label={`${selectedForm.questions?.length || 0} Questions`} color='primary' />
                  <Typography variant='body1' sx={{ color: '#457b9d' }}>
                    Manager: {getManagerName(selectedForm.managerId)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 700, mb: 2 }}>
                  Form Questions
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <FleetSeekTableHead width='5%'>#</FleetSeekTableHead>
                        <FleetSeekTableHead width='45%'>Question</FleetSeekTableHead>
                        <FleetSeekTableHead width='15%'>Type</FleetSeekTableHead>
                        <FleetSeekTableHead width='15%'>Required</FleetSeekTableHead>
                        <FleetSeekTableHead width='20%'>Options</FleetSeekTableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedForm.questions?.length > 0 ? (
                        selectedForm.questions.map((question, index) => (
                          <FleetSeekTableRow key={index} isEven={index % 2 === 0}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{question.question}</TableCell>
                            <TableCell>
                              <DetailChip
                                label={getQuestionTypeLabel(question.type)}
                                color={index % 2 === 0 ? 'primary' : 'secondary'}
                                size='small'
                              />
                            </TableCell>
                            <TableCell>
                              {question.required ? (
                                <Chip
                                  label='Required'
                                  size='small'
                                  sx={{
                                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                    color: '#2ecc71',
                                    fontWeight: 600
                                  }}
                                />
                              ) : (
                                <Chip
                                  label='Optional'
                                  size='small'
                                  sx={{
                                    backgroundColor: 'rgba(149, 165, 166, 0.1)',
                                    color: '#7f8c8d',
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {question.options?.length > 0 ? (
                                <Box
                                  component='span'
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    alert(`Options: ${question.options.join(', ')}`)
                                  }}
                                >
                                  {`${question.options.length} options`}
                                </Box>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                          </FleetSeekTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align='center'>
                            No questions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                    router.push(`/tripForms/form/${selectedForm._id}`)
                  }}
                >
                  Edit Form
                </FleetSeekButton>
              </Box>
            </>
          )}
        </TripFormDetailPaper>
      </TripFormDetailModal>
    </FleetSeekCard>
  )
}

export default TripFormsList

TripFormsList.acl = {
  action: 'read',
  subject: 'trip-forms-edit'
}
