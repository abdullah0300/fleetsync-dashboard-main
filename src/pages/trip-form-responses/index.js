import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'

import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Modal,
  Paper,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Box
} from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// CustomInput for react-datepicker (optional for styling)
const CustomInput = ({ value, onClick, label }) => (
  <TextField fullWidth size='small' label={label} onClick={onClick} value={value} readOnly />
)

// Styled components (copied from tripForms for consistency)
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

const TripFormResponses = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [trucks, setTrucks] = useState([])

  // Filters
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [truckFilter, setTruckFilter] = useState('')
  const [flaggedFilter, setFlaggedFilter] = useState('') // yes/no
  const [statusFilter, setStatusFilter] = useState('Issues Found') // default value
  const [searchValue, setSearchValue] = useState('')

  // Dialog for any future delete or details (optional)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedResponseId, setSelectedResponseId] = useState(null)

  // Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState(null)

  const fetchTrucks = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTrucks(res.data.data)
    } catch (error) {
      console.error('Error fetching trucks', error)
    }
  }

  const fetchTripResponses = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const params = {}

      if (startDate) params.startDate = startDate.toISOString().split('T')[0]
      if (endDate) params.endDate = endDate.toISOString().split('T')[0]
      if (truckFilter) params.truckId = truckFilter
      if (flaggedFilter) params.isFlaggedForReview = flaggedFilter === 'yes' ? true : false
      if (statusFilter) params.overallStatus = statusFilter

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripform-responses`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })

      setRows(res.data.data)
    } catch (error) {
      console.error('Error fetching trip form responses', error)
    }
  }

  // Fetch trucks once
  useEffect(() => {
    fetchTrucks()
  }, [])

  // Fetch trip responses on filters change
  useEffect(() => {
    fetchTripResponses()
  }, [startDate, endDate, truckFilter, flaggedFilter, statusFilter])

  // Client-side search filtering by driver's name or truck VIN or regNumber
  const filteredRows = rows.filter(row => {
    const driverName = `${row.driverUserId?.fullName?.firstName || ''} ${
      row.driverUserId?.fullName?.lastName || ''
    }`.toLowerCase()
    const truckVin = row.truckId?.vin?.toLowerCase() || ''
    const truckReg = row.truckId?.regNumber?.toLowerCase() || ''
    const query = searchValue.toLowerCase()
    return driverName.includes(query) || truckVin.includes(query) || truckReg.includes(query)
  })

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{ fileName: 'trips-report' }}
          excelOptions={{ fileName: 'trips-report' }}
        />
      </GridToolbarContainer>
    )
  }

  // Columns for DataGrid
  const columns = [
    {
      field: 'driverName',
      headerName: 'Driver Name',
      flex: 1,
      minWidth: 180,
      valueGetter: params =>
        `${params.row.driverUserId?.fullName?.firstName || ''} ${params.row.driverUserId?.fullName?.lastName || ''}`,
      getExportValue: params =>
        `${params.row.driverUserId?.fullName?.firstName || ''} ${params.row.driverUserId?.fullName?.lastName || ''}`
    },
    {
      field: 'driverEmail',
      headerName: 'Driver Email',
      flex: 1,
      minWidth: 200,
      valueGetter: params => params.row.driverUserId?.email || '',
      getExportValue: params => params.row.driverUserId?.email || ''
    },
    {
      field: 'truckInfo',
      headerName: 'Truck',
      flex: 1,
      minWidth: 220,
      valueGetter: params =>
        `${params.row.truckId?.model || ''} (${params.row.truckId?.vin || ''}) - ${
          params.row.truckId?.regNumber || ''
        }`,
      getExportValue: params =>
        `${params.row.truckId?.model || ''} (${params.row.truckId?.vin || ''}) - ${params.row.truckId?.regNumber || ''}`
    },
    {
      field: 'formName',
      headerName: 'Form Name',
      flex: 1,
      minWidth: 180,
      valueGetter: params => params.row.formDefinitionId?.formName || '',
      getExportValue: params => params.row.formDefinitionId?.formName || ''
    },
    {
      field: 'overallStatus',
      headerName: 'Overall Status',
      flex: 1,
      minWidth: 140
    },
    {
      field: 'isFlaggedForReview',
      headerName: 'Flagged for Review',
      flex: 1,
      minWidth: 140,
      renderCell: params => (
        <Typography color={params.value ? 'green' : 'gray'}>{params.value ? 'Yes' : 'No'}</Typography>
      ),
      valueGetter: params => (params.row.isFlaggedForReview ? 'Yes' : 'No'),
      getExportValue: params => (params.row.isFlaggedForReview ? 'Yes' : 'No')
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 180,
      valueGetter: params => new Date(params.row.createdAt).toLocaleString(),
      getExportValue: params => new Date(params.row.createdAt).toLocaleString()
    }
    // Optional: Add actions if needed (view details, edit, etc)
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   sortable: false,
    //   minWidth: 150,
    //   renderCell: ({ row }) => (
    //     <>
    //       <IconButton color='primary' onClick={() => router.push(`/tripform-responses/${row._id}`)}>
    //         <Icon icon='tabler:eye' />
    //       </IconButton>
    //     </>
    //   )
    // }
  ]

  const handleDateChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  // Helper for question type label
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
      case 'YesNo':
        return 'Yes / No'
      case 'TextInput':
        return 'Text Input'
      default:
        return type || 'Unknown'
    }
  }

  return (
    <Card>
      <CardHeader title='Trip Form Responses' />

      {/* Filters */}
      <Grid container spacing={2} sx={{ px: 4, pb: 2 }}>
        {/* Search */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size='small'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder='Search by Driver, Truck VIN or Reg Number'
          />
        </Grid>

        {/* Date range picker */}
        <Grid item xs={12} md={3}>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            isClearable
            customInput={<CustomInput label='Date Range' />}
          />
        </Grid>

        {/* Truck Dropdown */}
        <Grid item xs={12} md={2}>
          <Select
            fullWidth
            size='small'
            value={truckFilter}
            onChange={e => setTruckFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value=''>All Trucks</MenuItem>
            {trucks.map(truck => (
              <MenuItem key={truck._id} value={truck._id}>
                {truck.model} - {truck.vin}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Flagged for Review */}
        <Grid item xs={12} md={2}>
          <Select
            fullWidth
            size='small'
            value={flaggedFilter}
            onChange={e => setFlaggedFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value=''>Flagged for Review (All)</MenuItem>
            <MenuItem value='yes'>Yes</MenuItem>
            <MenuItem value='no'>No</MenuItem>
          </Select>
        </Grid>

        {/* Overall Status */}
        <Grid item xs={12} md={2}>
          <Select
            fullWidth
            size='small'
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value=''>All Statuses</MenuItem>
            <MenuItem value='Issues Found'>Issues Found</MenuItem>
            <MenuItem value='Passed'>Passed</MenuItem>
            {/* Add more statuses if any */}
          </Select>
        </Grid>
      </Grid>

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
        checkboxSelection
        onRowClick={params => {
          setSelectedResponse(params.row)
          setDetailModalOpen(true)
        }}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer'
          }
        }}
      />

      {/* Optional delete dialog (if you want to add delete feature) */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this response? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color='error'
            onClick={() => {
              // Add delete handler here if needed
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Modal for answers */}
      <TripFormDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='trip-form-response-detail-modal'
      >
        <TripFormDetailPaper>
          {selectedResponse && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                  {selectedResponse.formDefinitionId?.formName || 'Trip Form Response'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DetailChip label={selectedResponse.responses?.length + ' Answers'} color='primary' />
                  <Typography variant='body1' sx={{ color: '#457b9d' }}>
                    Driver: {selectedResponse.driverUserId?.fullName?.firstName}{' '}
                    {selectedResponse.driverUserId?.fullName?.lastName}
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#457b9d' }}>
                    Truck: {selectedResponse.truckId?.model} ({selectedResponse.truckId?.vin})
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 700, mb: 2 }}>
                  Questions & Answers
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: '0.75rem', overflow: 'hidden' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <FleetSeekTableHead width='5%'>#</FleetSeekTableHead>
                        <FleetSeekTableHead width='35%'>Question</FleetSeekTableHead>
                        <FleetSeekTableHead width='15%'>Type</FleetSeekTableHead>
                        <FleetSeekTableHead width='10%'>Required</FleetSeekTableHead>
                        <FleetSeekTableHead width='10%'>Issue</FleetSeekTableHead>
                        {/* <FleetSeekTableHead width='15%'>Options</FleetSeekTableHead> */}
                        <FleetSeekTableHead width='20%'>Answer</FleetSeekTableHead>
                        <FleetSeekTableHead width='20%'>Comments</FleetSeekTableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedResponse.responses?.length > 0 ? (
                        selectedResponse.responses.map((item, index) => (
                          <FleetSeekTableRow key={index} isEven={index % 2 === 0}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.question?.question || ''}</TableCell>
                            <TableCell>
                              <DetailChip
                                label={getQuestionTypeLabel(item.question?.type)}
                                color={index % 2 === 0 ? 'primary' : 'secondary'}
                                size='small'
                              />
                            </TableCell>
                            <TableCell>
                              {item.question?.required || item.question?.isRequired ? (
                                <Chip
                                  label='Required'
                                  size='small'
                                  sx={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', fontWeight: 600 }}
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
                              {item?.isIssue ? (
                                <Chip
                                  label='Yes'
                                  size='small'
                                  sx={{ backgroundColor: 'rgba(250, 0, 0, 0.1)', color: '#fa0000', fontWeight: 600 }}
                                />
                              ) : (
                                <Chip
                                  label='No'
                                  size='small'
                                  sx={{
                                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                    color: '#2ecc71',
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </TableCell>
                            {/* <TableCell>
                              {item.question?.options?.length > 0 ? (
                                <Box
                                  component='span'
                                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    alert(`Options: ${item.question.options.join(', ')}`)
                                  }}
                                >
                                  {`${item.question.options.length} options`}
                                </Box>
                              ) : (
                                '—'
                              )}
                            </TableCell> */}
                            <TableCell>{Array.isArray(item.answer) ? item.answer.join(', ') : item.answer}</TableCell>
                            <TableCell>
                              {Array.isArray(item.comment) ? item.comment.join(', ') : item.comment}
                            </TableCell>
                          </FleetSeekTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align='center'>
                            No answers found
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
                    '&:hover': { borderColor: '#1d3557', backgroundColor: 'rgba(29, 53, 87, 0.05)' }
                  }}
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </TripFormDetailPaper>
      </TripFormDetailModal>
    </Card>
  )
}

export default TripFormResponses
TripFormResponses.acl = {
  action: 'read',
  subject: 'trip-form-responses-page'
}
