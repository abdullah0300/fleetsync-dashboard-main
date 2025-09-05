import axios from 'axios'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getInitials } from 'src/@core/utils/get-initials'

// Reusable FleetSeek styled components
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
    borderRadius: '8px',
    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
    '&:hover fieldset': { borderColor: '#457b9d' },
    '&.Mui-focused fieldset': { borderColor: '#e63946' }
  }
}))

const FleetSeekSelect = styled(Select)(({ theme }) => ({
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#457b9d' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e63946' }
}))

const OnTimeChip = styled(Chip)(({ theme, ontime }) => ({
  fontWeight: 600,
  ...(ontime === 'Yes' && {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    color: '#2ecc71'
  }),
  ...(ontime === 'No' && {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
    color: '#e63946'
  })
}))

const LogDetailModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const LogDetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  maxWidth: '90%',
  width: '900px',
  maxHeight: '90vh',
  overflow: 'auto'
}))

const DetailSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  marginBottom: theme.spacing(2)
}))

const FleetSeekButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e63946',
  color: '#ffffff',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#c62b37',
    boxShadow: '0 8px 15px rgba(230, 57, 70, 0.2)'
  }
}))

const CustomInput = ({ value, onClick, label }) => (
  <FleetSeekTextField fullWidth size='small' label={label} onClick={onClick} value={value} readOnly />
)

const CustomToolbar = () => (
  <GridToolbarContainer sx={{ p: 1 }}>
    <GridToolbarExport printOptions={{ disableToolbarButton: true }} csvOptions={{ fileName: 'driver-logs-report' }} />
  </GridToolbarContainer>
)

const DriverLogs = () => {
  const [logs, setLogs] = useState([])
  const [trucks, setTrucks] = useState([])
  const [drivers, setDrivers] = useState([])
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    truckId: '',
    driverUserId: '',
    onTime: '',
    search: ''
  })

  const token = window.localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  // Fetch data functions
  const fetchData = async (endpoint, params = {}) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/${endpoint}`, {
        headers,
        params
      })

      return data.data
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}`, err)

      return []
    }
  }

  useEffect(() => {
    Promise.all([fetchData('trucks').then(setTrucks), fetchData('users', { role: 'Driver' }).then(setDrivers)])
  }, [])

  useEffect(() => {
    const params = {}
    if (filters.startDate) params.startDate = filters.startDate.toISOString().split('T')[0]
    if (filters.endDate) params.endDate = filters.endDate.toISOString().split('T')[0]
    if (filters.truckId) params.truckId = filters.truckId
    if (filters.driverUserId) params.driverUserId = filters.driverUserId
    if (filters.onTime) params.isSubmittedOnTime = filters.onTime === 'yes'

    fetchData('dailylogs', params).then(setLogs)
  }, [filters.startDate, filters.endDate, filters.truckId, filters.driverUserId, filters.onTime])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleDateChange = dates => {
    const [start, end] = dates
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }))
  }

  const handleRowClick = params => {
    setSelectedLog(params.row)
    setDetailModalOpen(true)
  }

  const handleViewDetails = (e, row) => {
    e.stopPropagation()
    setSelectedLog(row)
    setDetailModalOpen(true)
  }

  const handleExportLog = () => {
    if (!selectedLog) return

    // Prepare CSV data
    const csvData = []

    // Add headers
    csvData.push(['Driver Daily Log Report'])
    csvData.push([])
    csvData.push(['Log Date:', new Date(selectedLog.logDate).toLocaleDateString()])
    csvData.push(['Submission Time:', new Date(selectedLog.submissionTimestamp).toLocaleString()])
    csvData.push(['Submitted On Time:', selectedLog.isSubmittedOnTime ? 'Yes' : 'No'])
    csvData.push([])

    // Driver Information
    csvData.push(['Driver Information'])
    csvData.push([
      'Name:',
      `${selectedLog.driverUserId?.fullName?.firstName || ''} ${selectedLog.driverUserId?.fullName?.lastName || ''}`
    ])
    csvData.push(['Email:', selectedLog.driverUserId?.email || 'N/A'])
    csvData.push([])

    // Truck Information
    csvData.push(['Truck Information'])
    csvData.push(['Model:', selectedLog.truckId?.model || 'N/A'])
    csvData.push(['Registration:', selectedLog.truckId?.regNumber || 'N/A'])
    csvData.push(['VIN:', selectedLog.truckId?.vin || 'N/A'])
    csvData.push([])

    // Trip Details
    csvData.push(['Trip Details'])
    csvData.push(['Total Miles Today:', selectedLog.totalMilesToday || 0])
    csvData.push(['Starting Odometer:', selectedLog.startingOdometer || 'N/A'])
    csvData.push(['Ending Odometer:', selectedLog.endingOdometer || 'N/A'])
    csvData.push(['Fuel Added:', selectedLog.fuelAdded || 'N/A'])
    csvData.push(['DEF Added:', selectedLog.defAdded || 'N/A'])
    csvData.push([])

    // Log Entries
    if (selectedLog.logEntries && selectedLog.logEntries.length > 0) {
      csvData.push(['Log Entries'])
      csvData.push(['Time', 'Status', 'Location', 'Notes'])
      selectedLog.logEntries.forEach(entry => {
        csvData.push([entry.time || 'N/A', entry.status || 'N/A', entry.location || 'N/A', entry.notes || ''])
      })
    }

    // Convert to CSV string
    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    // Generate filename
    const driverName = `${selectedLog.driverUserId?.fullName?.firstName || ''}_${
      selectedLog.driverUserId?.fullName?.lastName || ''
    }`.replace(/\s+/g, '_')
    const logDate = new Date(selectedLog.logDate).toISOString().split('T')[0]
    const filename = `driver_log_${driverName}_${logDate}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Client-side search
  const filteredLogs = logs.filter(log => {
    if (!filters.search) return true
    const searchLower = filters.search.toLowerCase()

    const driverName = `${log.driverUserId?.fullName?.firstName || ''} ${
      log.driverUserId?.fullName?.lastName || ''
    }`.toLowerCase()

    return [driverName, log.driverUserId?.email || '', log.truckId?.vin || '', log.truckId?.regNumber || ''].some(
      field => field.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 1.2,
      minWidth: 220,
      renderCell: ({ row }) => {
        const name = `${row.driverUserId?.fullName?.firstName || ''} ${row.driverUserId?.fullName?.lastName || ''}`

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                mr: 2,
                width: 35,
                height: 35,
                bgcolor: 'rgba(230, 57, 70, 0.1)',
                color: '#e63946',
                fontSize: '.9rem'
              }}
            >
              {getInitials(name || 'D')}
            </Avatar>
            <Box>
              <Typography variant='body2' sx={{ fontWeight: 500, color: '#1d3557' }}>
                {name}
              </Typography>
              <Typography variant='caption' sx={{ color: '#457b9d' }}>
                {row.driverUserId?.email || ''}
              </Typography>
            </Box>
          </Box>
        )
      },
      valueGetter: ({ row }) =>
        `${row.driverUserId?.fullName?.firstName || ''} ${row.driverUserId?.fullName?.lastName || ''}`,
      getExportValue: ({ row }) =>
        `${row.driverUserId?.fullName?.firstName || ''} ${row.driverUserId?.fullName?.lastName || ''} - ${
          row.driverUserId?.email || ''
        }`
    },
    {
      field: 'truck',
      headerName: 'Truck',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant='body2' sx={{ fontWeight: 500, color: '#1d3557' }}>
            {row.truckId?.model || ''} - {row.truckId?.regNumber || ''}
          </Typography>
          <Typography variant='caption' sx={{ color: '#457b9d' }}>
            VIN: {row.truckId?.vin || ''}
          </Typography>
        </Box>
      ),
      valueGetter: ({ row }) =>
        `${row.truckId?.model || ''} (${row.truckId?.vin || ''}) - ${row.truckId?.regNumber || ''}`,
      getExportValue: ({ row }) =>
        `${row.truckId?.model || ''} (${row.truckId?.vin || ''}) - ${row.truckId?.regNumber || ''}`
    },
    {
      field: 'logDate',
      headerName: 'Log Date',
      flex: 0.7,
      minWidth: 120,
      valueGetter: ({ row }) => new Date(row.logDate).toLocaleDateString(),
      renderCell: ({ value }) => (
        <Typography variant='body2' sx={{ fontWeight: 500, color: '#1d3557' }}>
          {value}
        </Typography>
      )
    },
    {
      field: 'totalMilesToday',
      headerName: 'Miles',
      flex: 0.5,
      minWidth: 80,
      renderCell: ({ value }) => (
        <Chip
          label={value || 0}
          size='small'
          sx={{
            bgcolor: 'rgba(69, 123, 157, 0.1)',
            color: '#457b9d',
            fontWeight: 600
          }}
        />
      )
    },
    {
      field: 'isSubmittedOnTime',
      headerName: 'On Time',
      flex: 0.6,
      minWidth: 100,
      renderCell: ({ value }) => <OnTimeChip label={value ? 'Yes' : 'No'} ontime={value ? 'Yes' : 'No'} size='small' />,
      valueGetter: ({ row }) => (row.isSubmittedOnTime ? 'Yes' : 'No')
    },
    {
      field: 'submissionTimestamp',
      headerName: 'Submitted',
      flex: 0.8,
      minWidth: 140,
      renderCell: ({ value }) => (
        <Box>
          <Typography variant='body2' sx={{ color: '#1d3557' }}>
            {new Date(value).toLocaleDateString()}
          </Typography>
          <Typography variant='caption' sx={{ color: '#457b9d' }}>
            {new Date(value).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
      valueGetter: ({ row }) => new Date(row.submissionTimestamp).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      disableExport: true,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <IconButton size='small' sx={{ color: '#457b9d' }} onClick={e => handleViewDetails(e, row)}>
            <Icon icon='tabler:eye' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const filterConfig = [
    {
      component: FleetSeekTextField,
      props: {
        placeholder: 'Search by Driver, Truck, Email...',
        value: filters.search,
        onChange: e => handleFilterChange('search', e.target.value),
        InputProps: {
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='tabler:search' />
            </InputAdornment>
          )
        }
      }
    },
    {
      component: DatePicker,
      props: {
        selectsRange: true,
        startDate: filters.startDate,
        endDate: filters.endDate,
        onChange: handleDateChange,
        isClearable: true,
        customInput: <CustomInput label='Date Range' />
      }
    },
    {
      component: FleetSeekSelect,
      props: {
        value: filters.driverUserId,
        onChange: e => handleFilterChange('driverUserId', e.target.value),
        displayEmpty: true,
        children: [
          <MenuItem key='all' value=''>
            All Drivers
          </MenuItem>,
          ...drivers.map(driver => (
            <MenuItem key={driver._id} value={driver._id}>
              {driver.fullName?.firstName} {driver.fullName?.lastName}
            </MenuItem>
          ))
        ]
      }
    },
    {
      component: FleetSeekSelect,
      props: {
        value: filters.truckId,
        onChange: e => handleFilterChange('truckId', e.target.value),
        displayEmpty: true,
        children: [
          <MenuItem key='all' value=''>
            All Trucks
          </MenuItem>,
          ...trucks.map(truck => (
            <MenuItem key={truck._id} value={truck._id}>
              {truck.model} - {truck.vin}
            </MenuItem>
          ))
        ]
      }
    },
    {
      component: FleetSeekSelect,
      props: {
        value: filters.onTime,
        onChange: e => handleFilterChange('onTime', e.target.value),
        displayEmpty: true,
        children: [
          <MenuItem key={1} value=''>
            All Submissions
          </MenuItem>,
          <MenuItem key={2} value='yes'>
            On Time
          </MenuItem>,
          <MenuItem key={3} value='no'>
            Late
          </MenuItem>
        ]
      }
    }
  ]

  return (
    <FleetSeekCard>
      <FleetSeekCardHeader title='Driver Logs' />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {filterConfig.map((filter, index) => (
            <Grid item xs={12} md={index === 0 ? 4 : index === 1 ? 3 : 2} key={index}>
              <filter.component {...filter.props} fullWidth size='small' />
            </Grid>
          ))}
        </Grid>
      </Box>

      <DataGrid
        autoHeight
        getRowId={row => row._id}
        rows={filteredLogs}
        columns={columns}
        components={{ Toolbar: CustomToolbar }}
        slotProps={{
          baseButton: { size: 'medium', variant: 'tonal' }
        }}
        pagination
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } }
        }}
        checkboxSelection
        onRowClick={handleRowClick}
        sx={{
          border: 'none',
          px: 3,
          pb: 3,
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
            py: 2
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(168, 218, 220, 0.08)' },
            '&.Mui-selected': {
              backgroundColor: 'rgba(230, 57, 70, 0.08)',
              '&:hover': { backgroundColor: 'rgba(230, 57, 70, 0.12)' }
            }
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(29, 53, 87, 0.05)',
            borderBottom: '2px solid rgba(29, 53, 87, 0.1)',
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#1d3557'
            }
          },
          '& .MuiCheckbox-root': {
            color: '#457b9d',
            '&.Mui-checked': { color: '#e63946' }
          }
        }}
      />

      {/* Log Detail Modal */}
      <LogDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        aria-labelledby='log-detail-modal'
      >
        <LogDetailPaper>
          {selectedLog && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant='h4' sx={{ color: '#1d3557', fontWeight: 700, mb: 1 }}>
                    Daily Log Details
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={new Date(selectedLog.logDate).toLocaleDateString()}
                      sx={{ bgcolor: 'rgba(69, 123, 157, 0.1)', color: '#457b9d' }}
                    />
                    <OnTimeChip
                      label={selectedLog.isSubmittedOnTime ? 'Submitted On Time' : 'Submitted Late'}
                      ontime={selectedLog.isSubmittedOnTime ? 'Yes' : 'No'}
                    />
                  </Box>
                </Box>
                <IconButton onClick={() => setDetailModalOpen(false)}>
                  <Icon icon='tabler:x' />
                </IconButton>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailSection sx={{ backgroundColor: 'rgba(241, 250, 238, 0.5)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          width: 50,
                          height: 50,
                          bgcolor: 'rgba(230, 57, 70, 0.1)',
                          color: '#e63946'
                        }}
                      >
                        {getInitials(
                          `${selectedLog.driverUserId?.fullName?.firstName || ''} ${
                            selectedLog.driverUserId?.fullName?.lastName || ''
                          }`
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle2' sx={{ color: '#457b9d' }}>
                          Driver Information
                        </Typography>
                        <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                          {`${selectedLog.driverUserId?.fullName?.firstName || ''} ${
                            selectedLog.driverUserId?.fullName?.lastName || ''
                          }`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant='body2' sx={{ color: '#457b9d' }}>
                      {selectedLog.driverUserId?.email || ''}
                    </Typography>
                  </DetailSection>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)' }}>
                    <Typography variant='subtitle2' sx={{ color: '#457b9d', mb: 1 }}>
                      Truck Information
                    </Typography>
                    <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                      {selectedLog.truckId?.model || ''} - {selectedLog.truckId?.regNumber || ''}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#457b9d' }}>
                      VIN: {selectedLog.truckId?.vin || ''}
                    </Typography>
                  </DetailSection>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Trip Summary */}
              <Box sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 700, mb: 2 }}>
                  Trip Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(241, 250, 238, 0.3)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Total Miles
                      </Typography>
                      <Typography variant='h5' sx={{ color: '#1d3557', fontWeight: 700 }}>
                        {selectedLog.totalMilesToday || 0}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Starting Odometer
                      </Typography>
                      <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.startingOdometer || 'N/A'}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(241, 250, 238, 0.3)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Ending Odometer
                      </Typography>
                      <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.endingOdometer || 'N/A'}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Submission Time
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {new Date(selectedLog.submissionTimestamp).toLocaleTimeString()}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Driving Hours
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.hoursAllocation.driving}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        On Duty Hours
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.hoursAllocation.onDuty}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Off Duty Hours
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.hoursAllocation.offDuty}
                      </Typography>
                    </DetailSection>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DetailSection sx={{ backgroundColor: 'rgba(168, 218, 220, 0.1)', textAlign: 'center' }}>
                      <Typography variant='caption' sx={{ color: '#457b9d' }}>
                        Sleeper Berth Hours
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#1d3557', fontWeight: 600 }}>
                        {selectedLog.hoursAllocation.sleeperBerth}
                      </Typography>
                    </DetailSection>
                  </Grid>
                </Grid>
              </Box>

              {/* Fuel & DEF Information */}
              {(selectedLog.fuelAdded || selectedLog.defAdded) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 700, mb: 2 }}>
                    Fuel & DEF Information
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedLog.fuelAdded && (
                      <Grid item xs={6}>
                        <DetailSection
                          sx={{ backgroundColor: 'rgba(230, 57, 70, 0.05)', borderLeft: '4px solid #e63946' }}
                        >
                          <Typography variant='caption' sx={{ color: '#457b9d' }}>
                            Fuel Added
                          </Typography>
                          <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                            {selectedLog.fuelAdded} gallons
                          </Typography>
                        </DetailSection>
                      </Grid>
                    )}
                    {selectedLog.defAdded && (
                      <Grid item xs={6}>
                        <DetailSection
                          sx={{ backgroundColor: 'rgba(69, 123, 157, 0.05)', borderLeft: '4px solid #457b9d' }}
                        >
                          <Typography variant='caption' sx={{ color: '#457b9d' }}>
                            DEF Added
                          </Typography>
                          <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 600 }}>
                            {selectedLog.defAdded} gallons
                          </Typography>
                        </DetailSection>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Log Entries Table */}
              {selectedLog.logEntries && selectedLog.logEntries.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ color: '#1d3557', fontWeight: 700, mb: 2 }}>
                    Log Entries
                  </Typography>
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'rgba(29, 53, 87, 0.05)' }}>
                          <TableCell sx={{ fontWeight: 700, color: '#1d3557' }}>Time</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#1d3557' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#1d3557' }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#1d3557' }}>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedLog.logEntries.map((entry, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              '&:hover': { backgroundColor: 'rgba(168, 218, 220, 0.05)' },
                              backgroundColor: index % 2 === 0 ? 'rgba(241, 250, 238, 0.3)' : 'transparent'
                            }}
                          >
                            <TableCell>{entry.time || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={entry.status || 'N/A'}
                                size='small'
                                sx={{
                                  bgcolor: 'rgba(69, 123, 157, 0.1)',
                                  color: '#457b9d',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>{entry.location || 'N/A'}</TableCell>
                            <TableCell>{entry.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

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
                  startIcon={<Icon icon='tabler:download' />}
                  onClick={handleExportLog}
                >
                  Export Log
                </FleetSeekButton>
              </Box>
            </>
          )}
        </LogDetailPaper>
      </LogDetailModal>
    </FleetSeekCard>
  )
}

export default DriverLogs

DriverLogs.acl = {
  action: 'read',
  subject: 'driver-logs-page'
}
