// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'

// ** React Imports
import { useEffect, useState } from 'react'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAuth } from 'src/hooks/useAuth'

// ** FleetSeek Theme Colors
const fleetSeekColors = {
  primary: '#e63946',
  secondary: '#457b9d',
  darkBlue: '#1d3557',
  lightBlue: '#a8dadc',
  offWhite: '#f1faee',
  darkGray: '#2A2A2A',
  lightGray: '#e4dede'
}

// ** Styled Components
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  padding: theme.spacing(2),
  overflow: 'hidden',
  borderRadius: '10px',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '210px',
    height: '210px',
    borderRadius: '50%',
    top: '-85px',
    right: '-95px',
    opacity: 0.08,
    zIndex: 0
  }
}))

const PrimaryStatsCard = styled(StatsCard)(() => ({
  '&:after': {
    backgroundColor: fleetSeekColors.primary
  }
}))

const SecondaryStatsCard = styled(StatsCard)(() => ({
  '&:after': {
    backgroundColor: fleetSeekColors.secondary
  }
}))

const DarkBlueStatsCard = styled(StatsCard)(() => ({
  '&:after': {
    backgroundColor: fleetSeekColors.darkBlue
  }
}))

const LightBlueStatsCard = styled(StatsCard)(() => ({
  '&:after': {
    backgroundColor: fleetSeekColors.lightBlue
  }
}))

const GreenStatsCard = styled(StatsCard)(() => ({
  '&:after': {
    backgroundColor: '#4CAF50'
  }
}))

const StatusChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 600,
  borderRadius: '6px'
}))

const ChartWrapper = styled(Box)(({ theme }) => ({
  height: '100%'
}))

const TabsWrapper = styled(Tabs)(({ theme }) => ({
  minHeight: 38,
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0, 1, 0, 0),
    '&.Mui-selected': {
      backgroundColor: fleetSeekColors.primary,
      color: 'white'
    }
  }
}))

const Home = () => {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true)
      try {
        const token = window.localStorage.getItem('token')

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setDashboardData(response.data.data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Area chart options
  const areaChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: [fleetSeekColors.primary, fleetSeekColors.secondary],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      }
    }
  }

  // Donut chart options
  const donutChartOptions = {
    chart: {
      type: 'donut'
    },
    labels: [
      'Completed',
      'Scheduled'

      // , 'Delayed', 'Scheduled'
    ],
    colors: [
      fleetSeekColors.primary,
      fleetSeekColors.secondary

      // , fleetSeekColors.darkBlue, fleetSeekColors.lightBlue
    ],
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => dashboardData?.tripAnalytics?.totalResponses
            }
          }
        }
      }
    }
  }

  // Bar chart options
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: [fleetSeekColors.primary],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  }

  // Render status chip with color based on status
  const renderStatusChip = status => {
    let color = 'default'
    if (status === 'Completed') color = 'success'
    if (status === 'In Progress') color = 'info'
    if (status === 'Delayed') color = 'warning'
    if (status === 'Cancelled') color = 'error'

    return <StatusChip label={status} color={color} size='small' />
  }

  // if (!dashboardData) return <div>Loading...</div>

  return (
    <Grid container spacing={6}>
      {/* Dashboard Title Area */}
      <Grid item xs={12}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant='h4'
              sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mb: 1, fontFamily: 'Inter, sans-serif' }}
            >
              Dashboard
            </Typography>
            <Typography variant='body2' sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}>
              Welcome back! Here's an overview of your fleet operations.
            </Typography>
          </Box>
          {/* <Button
            variant='contained'
            startIcon={<Icon icon='mdi:file-document-outline' />}
            sx={{
              bgcolor: fleetSeekColors.primary,
              '&:hover': {
                bgcolor: '#d32f2f' // Darker shade of primary red
              },
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px'
            }}
          >
            Generate Report
          </Button> */}
        </Box>
      </Grid>

      {/* Stats Cards */}
      {user?.role != 'Manager' && (
        <>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <PrimaryStatsCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant='h6'
                    sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
                  >
                    Companies
                  </Typography>
                  {loading ? (
                    <Skeleton variant='text' width={60} height={40} />
                  ) : (
                    <Typography
                      variant='h4'
                      sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mt: 1, fontFamily: 'Inter, sans-serif' }}
                    >
                      {dashboardData?.stats?.companies || '0'}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: `${fleetSeekColors.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon='mdi:office-building' color={fleetSeekColors.primary} fontSize={24} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                {loading ? (
                  <Skeleton variant='text' width={80} height={20} />
                ) : (
                  <>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter, sans-serif' }}
                    >
                      + {dashboardData?.stats?.additionsThisWeek?.companies || '0'}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ ml: 1, color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}
                    >
                      this week
                    </Typography>
                  </>
                )}
              </Box>
            </PrimaryStatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <SecondaryStatsCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant='h6'
                    sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
                  >
                    Users
                  </Typography>
                  <Typography
                    variant='h4'
                    sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mt: 1, fontFamily: 'Inter, sans-serif' }}
                  >
                    {dashboardData?.stats?.users || '---'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: `${fleetSeekColors.secondary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon icon='mdi:account-group' color={fleetSeekColors.secondary} fontSize={24} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter, sans-serif' }}>
                  +{dashboardData?.stats?.additionsThisWeek?.users || '0'}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ ml: 1, color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}
                >
                  this week
                </Typography>
              </Box>
            </SecondaryStatsCard>
          </Grid>
        </>
      )}

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <DarkBlueStatsCard elevation={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant='h6'
                sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Drivers
              </Typography>
              <Typography
                variant='h4'
                sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mt: 1, fontFamily: 'Inter, sans-serif' }}
              >
                {dashboardData?.stats?.drivers || '0'}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: `${fleetSeekColors.darkBlue}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon='mdi:account-hard-hat' color={fleetSeekColors.darkBlue} fontSize={24} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter, sans-serif' }}>
              +{dashboardData?.stats?.additionsThisWeek?.drivers || '0'}
            </Typography>
            <Typography
              variant='body2'
              sx={{ ml: 1, color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}
            >
              this week
            </Typography>
          </Box>
        </DarkBlueStatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <LightBlueStatsCard elevation={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant='h6'
                sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Trucks
              </Typography>
              <Typography
                variant='h4'
                sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mt: 1, fontFamily: 'Inter, sans-serif' }}
              >
                {dashboardData?.stats?.trucks || '0'}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: `${fleetSeekColors.lightBlue}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon='mdi:truck' color={fleetSeekColors.darkBlue} fontSize={24} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter, sans-serif' }}>
              +{dashboardData?.stats?.additionsThisWeek?.trucks || '0'}
            </Typography>
            <Typography
              variant='body2'
              sx={{ ml: 1, color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}
            >
              this week
            </Typography>
          </Box>
        </LightBlueStatsCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <GreenStatsCard elevation={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant='h6'
                sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}
              >
                Trip Forms
              </Typography>
              <Typography
                variant='h4'
                sx={{ color: fleetSeekColors.darkBlue, fontWeight: 700, mt: 1, fontFamily: 'Inter, sans-serif' }}
              >
                {dashboardData?.stats?.tripForms || '0'}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: 'rgba(76, 175, 80, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon='mdi:form-select' color='#4CAF50' fontSize={24} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter, sans-serif' }}>
              +{dashboardData?.stats?.additionsThisWeek?.tripForms || '0'}
            </Typography>
            <Typography
              variant='body2'
              sx={{ ml: 1, color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}
            >
              this week
            </Typography>
          </Box>
        </GreenStatsCard>
      </Grid>

      {/* Dashboard Tabs */}
      <Grid item xs={12}>
        <TabsWrapper value={activeTab} onChange={handleTabChange}>
          <Tab value='overview' label='Overview' sx={{ fontFamily: 'Inter, sans-serif' }} />
        </TabsWrapper>
      </Grid>

      {/* Main Dashboard Content - Left Column */}
      <Grid item xs={12} lg={8}>
        {/* Trip Analytics Chart */}
        <Card sx={{ mb: 6 }} elevation={3}>
          <CardHeader
            title='Trip Analytics'
            titleTypographyProps={{
              sx: {
                color: fleetSeekColors.darkBlue,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }
            }}
            action={
              <IconButton>
                <Icon icon='mdi:dots-vertical' />
              </IconButton>
            }
          />
          <CardContent>
            {Array.isArray(dashboardData?.tripSeries) && (
              <ChartWrapper>
                <ReactApexcharts
                  options={areaChartOptions}
                  series={dashboardData?.tripSeries}
                  type='area'
                  height={350}
                />
              </ChartWrapper>
            )}
          </CardContent>
        </Card>

        {/* Recent Trips Table */}
        <Card elevation={3}>
          <CardHeader
            title='Recent Trips'
            titleTypographyProps={{
              sx: {
                color: fleetSeekColors.darkBlue,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }
            }}
            action={
              <Button
                variant='text'
                endIcon={<Icon icon='mdi:arrow-right' />}
                sx={{
                  color: fleetSeekColors.primary,
                  fontFamily: 'Inter, sans-serif'
                }}
                onClick={() => {
                  router.push('/driver-logs')
                }}
              >
                View All
              </Button>
            }
          />
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: fleetSeekColors.lightGray }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Trip ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Driver</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Truck</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Distance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))
                ) : !dashboardData?.recentTrips?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                      <Typography variant='body1' sx={{ color: fleetSeekColors.darkGray }}>
                        No recent trips found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboardData?.recentTrips?.map(trip => (
                    <TableRow key={trip.id} hover>
                      <TableCell sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={trip?.driver?.avatar}
                            alt={trip?.driver?.name}
                            sx={{ width: 30, height: 30, mr: 2 }}
                          />
                          <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.driver?.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.truck}</TableCell>
                      <TableCell sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.remarks}</TableCell>
                      <TableCell sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.departureDate}</TableCell>
                      <TableCell sx={{ fontFamily: 'Inter, sans-serif' }}>{trip?.distance} mi</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} lg={4}>
        {/* Trip Status Distribution */}
        <Card sx={{ mb: 6 }} elevation={3}>
          <CardHeader
            title='Trip Status Distribution'
            titleTypographyProps={{
              sx: {
                color: fleetSeekColors.darkBlue,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />
          <CardContent>
            {typeof dashboardData?.tripAnalytics?.withErrors === 'number' &&
              typeof dashboardData?.tripAnalytics?.withoutErrors === 'number' && (
                <ReactApexcharts
                  options={donutChartOptions}
                  series={[dashboardData.tripAnalytics.withErrors, dashboardData.tripAnalytics.withoutErrors]}
                  type='donut'
                  height={300}
                />
              )}
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card elevation={3}>
          <CardHeader
            title='Maintenance Alerts'
            titleTypographyProps={{
              sx: {
                color: fleetSeekColors.darkBlue,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }
            }}
            action={
              <IconButton>
                <Icon icon='mdi:dots-vertical' />
              </IconButton>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Box key={index} sx={{ p: 2 }}>
                    <Skeleton variant='rectangular' height={60} />
                    {index < 2 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))
            ) : !dashboardData?.maintenanceAlerts?.length ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='body1' sx={{ color: fleetSeekColors.darkGray }}>
                  No maintenance alerts found
                </Typography>
              </Box>
            ) : (
              dashboardData.maintenanceAlerts.map((alert, index) => (
                <Box key={alert.id}>
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Icon
                          icon='mdi:truck-alert'
                          color={
                            alert.priority === 'High'
                              ? fleetSeekColors.primary
                              : alert.priority === 'Medium'
                              ? '#FF9800'
                              : fleetSeekColors.secondary
                          }
                          fontSize={20}
                          style={{ marginRight: '8px' }}
                        />
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontWeight: 600,
                            color: fleetSeekColors.darkBlue,
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {alert.type}
                        </Typography>
                      </Box>
                      <Typography
                        variant='body2'
                        sx={{
                          color: fleetSeekColors.darkGray,
                          mt: 0.5,
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Truck: {alert.truck}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          color: fleetSeekColors.darkGray,
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Due at: {alert.mileage}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={alert.priority}
                        size='small'
                        sx={{
                          bgcolor:
                            alert.priority === 'High'
                              ? `${fleetSeekColors.primary}20`
                              : alert.priority === 'Medium'
                              ? 'rgba(255, 152, 0, 0.2)'
                              : `${fleetSeekColors.secondary}20`,
                          color:
                            alert.priority === 'High'
                              ? fleetSeekColors.primary
                              : alert.priority === 'Medium'
                              ? '#FF9800'
                              : fleetSeekColors.secondary,
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif'
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{
                          mt: 1,
                          fontWeight: 500,
                          color: fleetSeekColors.darkGray,
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Due: {alert.dueDate}
                      </Typography>
                    </Box>
                  </Box>
                  {index < dashboardData.maintenanceAlerts.length - 1 && <Divider />}
                </Box>
              ))
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant='outlined'
                size='small'
                sx={{
                  borderColor: fleetSeekColors.secondary,
                  color: fleetSeekColors.secondary,
                  '&:hover': {
                    borderColor: fleetSeekColors.secondary,
                    bgcolor: `${fleetSeekColors.secondary}10`
                  },
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                View All
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={3}>
          <CardHeader
            title='Quick Actions'
            titleTypographyProps={{
              sx: {
                color: fleetSeekColors.darkBlue,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:truck-plus' />}
                  sx={{
                    borderColor: fleetSeekColors.darkBlue,
                    color: fleetSeekColors.darkBlue,
                    '&:hover': {
                      borderColor: fleetSeekColors.darkBlue,
                      bgcolor: `${fleetSeekColors.darkBlue}10`
                    },
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    height: '64px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => router.push('/trucks/form')}
                >
                  Add Truck
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:account-plus' />}
                  sx={{
                    borderColor: fleetSeekColors.secondary,
                    color: fleetSeekColors.secondary,
                    '&:hover': {
                      borderColor: fleetSeekColors.secondary,
                      bgcolor: `${fleetSeekColors.secondary}10`
                    },
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    height: '64px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => router.push('/drivers/form')}
                >
                  Add Driver
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:file-document-plus' />}
                  sx={{
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                      borderColor: '#4CAF50',
                      bgcolor: 'rgba(76, 175, 80, 0.1)'
                    },
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    height: '64px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => router.push('/tripForms/form')}
                >
                  New Form
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:file-document-plus' />}
                  sx={{
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                      borderColor: '#4CAF50',
                      bgcolor: 'rgba(76, 175, 80, 0.1)'
                    },
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    height: '64px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => router.push('/driver-logs')}
                >
                  Driver Logs
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home

Home.acl = {
  subject: 'dashboard-page',
  action: 'read'
}
