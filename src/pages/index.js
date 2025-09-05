// src/pages/index.js
// Professional Trucker'sCall Landing Page - Enterprise SaaS Design

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  useMediaQuery,
  Fade,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'

// Professional Color Palette - Inspired by Linear/Stripe
const palette = {
  background: '#FFFFFF',
  surface: '#FAFBFC',
  border: '#E4E7EB',
  text: {
    primary: '#0A0D14',
    secondary: '#4B5563',
    tertiary: '#9CA3AF'
  },
  brand: {
    primary: '#5046E5',
    primaryDark: '#4338CA',
    primaryLight: '#F4F3FF',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
}

// Styled Components - Clean & Minimal
const NavBar = styled(Box)(({ theme, scrolled }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : palette.background,
  backdropFilter: scrolled ? 'blur(8px)' : 'none',
  borderBottom: `1px solid ${scrolled ? palette.border : 'transparent'}`,
  transition: 'all 0.2s ease',
  zIndex: 1000,
  padding: theme.spacing(2, 0)
}))

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: palette.background,
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8)
  }
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: palette.brand.primary,
  color: palette.background,
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: palette.brand.primaryDark,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)'
  }
}))

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: palette.neutral[100],
  color: palette.text.primary,
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  border: `1px solid ${palette.border}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: palette.neutral[200],
    borderColor: palette.neutral[300]
  }
}))

const FeatureCard = styled(Card)(({ theme }) => ({
  backgroundColor: palette.background,
  border: `1px solid ${palette.border}`,
  borderRadius: '12px',
  padding: theme.spacing(3),
  height: '100%',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #5046E5, transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease'
  },
  '&:hover': {
    borderColor: palette.brand.primary,
    boxShadow: '0 6px 12px rgba(80, 70, 229, 0.08)',
    transform: 'translateY(-2px)',
    '&::before': {
      transform: 'translateX(0)'
    }
  }
}))

const MetricCard = styled(Paper)(({ theme }) => ({
  backgroundColor: palette.surface,
  border: `1px solid ${palette.border}`,
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: palette.neutral[300]
  }
}))

const MobilePreview = styled(Paper)(({ theme }) => ({
  backgroundColor: palette.neutral[900],
  borderRadius: '32px',
  padding: '8px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${palette.neutral[800]}`,
  overflow: 'hidden',
  position: 'relative',
  maxWidth: '320px',
  margin: '0 auto'
}))

const DashboardPreview = styled(Paper)(({ theme }) => ({
  backgroundColor: palette.neutral[900],
  borderRadius: '16px',
  padding: '8px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${palette.neutral[800]}`,
  overflow: 'hidden',
  position: 'relative',
  maxWidth: '400px',
  margin: '0 auto'
}))

const Badge = styled(Chip)(({ theme }) => ({
  backgroundColor: palette.brand.primaryLight,
  color: palette.brand.primary,
  fontWeight: 600,
  fontSize: '12px',
  height: '24px',
  border: 'none'
}))

const HomePage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [scrolled, setScrolled] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const features = [
    {
      icon: 'tabler:clipboard-list',
      title: 'Digital Trip Forms',
      description: 'Replace paper forms with smart digital checklists. Complete inspections in seconds.',
      metric: '90% faster'
    },
    {
      icon: 'tabler:clock',
      title: 'Hours of Service',
      description: 'Automated HOS tracking with real-time compliance monitoring and alerts.',
      metric: '100% compliant'
    },
    {
      icon: 'tabler:truck',
      title: 'Fleet Assignment',
      description: 'Instantly assign vehicles to drivers. Track status and location in real-time.',
      metric: 'Real-time sync'
    },
    {
      icon: 'tabler:file-report',
      title: 'One-Click Reports',
      description: 'Generate DOT-compliant reports instantly. Export to any format.',
      metric: 'Instant export'
    },
    {
      icon: 'tabler:shield-check',
      title: 'Compliance Ready',
      description: 'Stay audit-ready with automated compliance tracking and documentation.',
      metric: 'Zero violations'
    },
    {
      icon: 'tabler:devices',
      title: 'Works Everywhere',
      description: 'Native mobile apps for iOS and Android. Works offline, syncs when connected.',
      metric: 'Offline ready'
    }
  ]

  const testimonials = [
    {
      company: 'TransLogistics Inc.',
      text: 'Cut our paperwork time by 85%. Drivers love how simple it is.',
      author: 'Sarah Chen, Fleet Manager'
    },
    {
      company: 'Regional Freight Co.',
      text: 'Zero DOT violations since implementing TruckersCall. Game changer.',
      author: 'Mike Rodriguez, Operations Director'
    },
    {
      company: 'Express Delivery LLC',
      text: 'The real-time tracking alone saved us thousands in the first month.',
      author: 'James Wilson, CEO'
    }
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    demo: false
  })

  const handleFormChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: field === 'demo' ? event.target.checked : event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // You can add API call here
    alert('Thank you for contacting us! We will get back to you soon.')
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      demo: false
    })
  }

  return (
    <>
      {/* Navigation */}
      <NavBar scrolled={scrolled}>
        <Container maxWidth='lg'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction='row' spacing={6} alignItems='center'>
              <Box
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ cursor: 'pointer' }}
              >
                <img
                  src="https://ik.imagekit.io/mctozv7td/truckers%20call_PJNvBU2hk?updatedAt=1757087437647"
                  alt="Trucker'sCall Logo"
                  width={160}
                  height={60}
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </Box>

              {!isMobile && (
                <Stack direction='row' spacing={4}>
                  <Button
                    onClick={() => scrollToSection('features')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    Features
                  </Button>
                  <Button
                    onClick={() => scrollToSection('how-it-works')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    How It Works
                  </Button>
                  <Button
                    onClick={() => scrollToSection('testimonials')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    Testimonials
                  </Button>
                  <Button
                    onClick={() => scrollToSection('contact')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    Contact
                  </Button>
                </Stack>
              )}
            </Stack>

            <Stack direction='row' spacing={2} alignItems='center'>
              {user ? (
                <PrimaryButton onClick={() => router.push('/home')}>
                  Open Dashboard
                </PrimaryButton>
              ) : (
                <>
                  {!isMobile && (
                    <Button
                      component={Link}
                      href='/login'
                      sx={{
                        color: palette.text.primary,
                        fontWeight: 500,
                        fontSize: '14px'
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                  <PrimaryButton onClick={() => scrollToSection('contact')}>
                     Let's Talk
                  </PrimaryButton>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </NavBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth='lg' style={{ marginTop: 34 }}>
          <Grid container spacing={8} alignItems='center'>
            <Grid item xs={12} lg={6}>
              <Box>
                <Badge label='NEW' sx={{ mb: 3 }} />
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: { xs: '36px', md: '48px', lg: '56px' },
                    fontWeight: 700,
                    color: palette.text.primary,
                    lineHeight: 1.1,
                    letterSpacing: '-2px',
                    mb: 3
                  }}
                >
                  Fleet management
                  <br />
                  made{' '}
                  <Box component='span' sx={{
                    color: palette.brand.primary,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: palette.brand.primary,
                      opacity: 0.2
                    }
                  }}>
                    simple
                  </Box>
                </Typography>

                <Typography
                  variant='h6'
                  sx={{
                    fontSize: '18px',
                    fontWeight: 400,
                    color: palette.text.secondary,
                    lineHeight: 1.6,
                    mb: 4
                  }}
                >
                  Digital forms, real-time tracking, and compliance management
                  in one platform. Save hours on paperwork and stay DOT compliant.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <PrimaryButton
                    onClick={() => scrollToSection('contact')}
                    size='large'
                    sx={{ px: 3 }}
                  >
                    Let's Talk
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => scrollToSection('contact')}
                    size='large'
                    sx={{ px: 3 }}
                  >
                    Book a demo
                  </SecondaryButton>
                </Stack>

                <Stack direction='row' spacing={3} alignItems='center'>
                  <Stack direction='row' spacing={-1}>
                    {[1,2,3,4].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: palette.neutral[200],
                          border: `2px solid ${palette.background}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon icon='tabler:user' fontSize={16} />
                      </Box>
                    ))}
                  </Stack>
                  <Typography variant='body2' sx={{ color: palette.text.secondary }}>
                    Join 10+ companies streamlining their fleet operations
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Two Preview Section */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                {/* Dashboard Preview */}
                <DashboardPreview elevation={0}>
                  <Box sx={{ p: 1.5 }}>
                    {/* Browser Bar */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                      pb: 1.5,
                      borderBottom: `1px solid ${palette.neutral[800]}`
                    }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF605C' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFBD44' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00CA4E' }} />
                      </Box>
                      <Box sx={{
                        flex: 1,
                        bgcolor: palette.neutral[800],
                        borderRadius: '4px',
                        px: 1.5,
                        py: 0.3
                      }}>
                        <Typography variant='caption' sx={{ color: palette.neutral[400], fontSize: '11px' }}>
                          app.Trucker'sCall.com/dashboard
                        </Typography>
                      </Box>
                    </Box>

                    {/* Dashboard Interface */}
                    <Box sx={{ bgcolor: palette.background, borderRadius: '8px', p: 2 }}>
                      {/* Dashboard Header */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='subtitle2' sx={{ fontWeight: 700, color: palette.text.primary }}>
                          Dashboard
                        </Typography>
                        <Typography variant='caption' sx={{ color: palette.text.secondary, fontSize: '10px' }}>
                          Welcome back! Here's your fleet overview
                        </Typography>
                      </Box>

                      {/* Stats Cards */}
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        {[
                          { label: 'Companies', value: '20', icon: 'tabler:building', color: palette.brand.error },
                          { label: 'Users', value: '80', icon: 'tabler:users', color: palette.brand.primary },
                          { label: 'Drivers', value: '25', icon: 'tabler:user', color: palette.brand.primary },
                          { label: 'Trucks', value: '20', icon: 'tabler:truck', color: palette.brand.primary },
                          { label: 'Trip Forms', value: '800', icon: 'tabler:clipboard-list', color: palette.brand.success }
                        ].map((stat, index) => (
                          <Grid item xs={12} key={index}>
                            <Paper sx={{
                              p: 1,
                              border: `1px solid ${palette.border}`,
                              borderRadius: '6px',
                              boxShadow: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <Icon icon={stat.icon} fontSize={14} style={{ color: stat.color }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant='caption' sx={{ color: palette.text.tertiary, fontSize: '9px' }}>
                                  {stat.label}
                                </Typography>
                                <Typography variant='body2' sx={{ fontWeight: 700, color: palette.text.primary, fontSize: '12px' }}>
                                  {stat.value}
                                </Typography>
                              </Box>
                              <Typography variant='caption' sx={{ color: palette.brand.success, fontSize: '9px' }}>
                                +1 this week
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Charts Row */}
                      <Grid container spacing={1}>
                        <Grid item xs={7}>
                          <Paper sx={{
                            p: 1,
                            border: `1px solid ${palette.border}`,
                            borderRadius: '6px',
                            boxShadow: 'none'
                          }}>
                            <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '10px' }}>
                              Trip Analytics
                            </Typography>
                            <Box sx={{ height: 60 }}>
                              <svg width="100%" height="100%" viewBox="0 0 200 60">
                                <path
                                  d="M 0 50 Q 50 10 100 30 T 200 20"
                                  fill="none"
                                  stroke={palette.brand.primary}
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M 0 50 Q 50 10 100 30 T 200 20 L 200 60 L 0 60 Z"
                                  fill={`${palette.brand.primary}15`}
                                />
                              </svg>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={5}>
                          <Paper sx={{
                            p: 1,
                            border: `1px solid ${palette.border}`,
                            borderRadius: '6px',
                            boxShadow: 'none'
                          }}>
                            <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '10px' }}>
                              Trip Status
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                              <Box sx={{ position: 'relative' }}>
                                <svg width="50" height="50" viewBox="0 0 50 50">
                                  <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    stroke={palette.brand.primary}
                                    strokeWidth="8"
                                    strokeDasharray="63 63"
                                    transform="rotate(-90 25 25)"
                                  />
                                  <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    stroke={palette.brand.error}
                                    strokeWidth="8"
                                    strokeDasharray="31 95"
                                    strokeDashoffset="-63"
                                    transform="rotate(-90 25 25)"
                                  />
                                </svg>
                                <Box sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  textAlign: 'center'
                                }}>
                                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: palette.text.primary }}>
                                    8
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </DashboardPreview>


              </Stack>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Logos Section */}
      <Box sx={{ py: 8, bgcolor: palette.surface, borderY: `1px solid ${palette.border}` }}>
        <Container maxWidth='lg'>
          <Typography
            variant='body2'
            sx={{
              textAlign: 'center',
              color: palette.text.tertiary,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            Trusted by fleet managers across the industry
          </Typography>
          <Stack
            direction='row'
            spacing={6}
            justifyContent='center'
            alignItems='center'
            sx={{ opacity: 0.6, filter: 'grayscale(1)' }}
          >
            {['Transport Co.', 'Logistics Inc.', 'Fleet Pro', 'QuickShip', 'CargoMax'].map((company) => (
              <Typography key={company} variant='body1' sx={{ fontWeight: 600, color: palette.text.secondary }}>
                {company}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box id="features" sx={{ py: 10, bgcolor: palette.background }}>
        <Container maxWidth='lg'>
          <Box sx={{ maxWidth: 700, mb: 8 }}>
            <Badge label='FEATURES' sx={{ mb: 2 }} />
            <Typography variant='h3' sx={{ fontWeight: 700, color: palette.text.primary, mb: 2 }}>
              Everything you need to manage your fleet
            </Typography>
            <Typography variant='body1' sx={{ color: palette.text.secondary, fontSize: '18px' }}>
              From compliance to real-time tracking, we've built the tools that modern fleet managers need.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <FeatureCard elevation={0}>
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        backgroundColor: palette.brand.primaryLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}
                    >
                      <Icon icon={feature.icon} fontSize={24} style={{ color: palette.brand.primary }} />
                    </Box>
                    <Typography variant='h6' sx={{ fontWeight: 600, color: palette.text.primary, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant='body2' sx={{ color: palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                    <Typography variant='caption' sx={{
                      color: palette.brand.primary,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      {feature.metric}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box id="how-it-works" sx={{ py: 10, bgcolor: palette.surface }}>
        <Container maxWidth='lg'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Badge label='HOW IT WORKS' sx={{ mb: 2 }} />
            <Typography variant='h3' sx={{ fontWeight: 700, color: palette.text.primary, mb: 2 }}>
              Get started in minutes
            </Typography>
            <Typography variant='body1' sx={{ color: palette.text.secondary, fontSize: '18px' }}>
              Simple setup, powerful results
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                number: '01',
                title: 'Sign up & add your fleet',
                description: 'Quick onboarding with guided setup. Import your existing data in seconds.'
              },
              {
                number: '02',
                title: 'Invite your drivers',
                description: 'Send invitations via email or SMS. Drivers download the app and they are ready to go.'
              },
              {
                number: '03',
                title: 'Start tracking',
                description: 'Digital forms, real-time updates, and compliance reports from day one.'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant='h2'
                    sx={{
                      fontWeight: 700,
                      color: palette.brand.primary,
                      mb: 2,
                      opacity: 0.2
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography variant='h6' sx={{ fontWeight: 600, color: palette.text.primary, mb: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: palette.text.secondary, lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box id="testimonials" sx={{ py: 10, bgcolor: palette.background }}>
        <Container maxWidth='lg'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Badge label='TESTIMONIALS' sx={{ mb: 2 }} />
            <Typography variant='h3' sx={{ fontWeight: 700, color: palette.text.primary }}>
              Loved by fleet managers
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: '12px',
                    border: `1px solid ${palette.border}`,
                    boxShadow: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Stack direction='row' spacing={0.5} sx={{ mb: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon='tabler:star-filled' fontSize={18} style={{ color: palette.brand.warning }} />
                    ))}
                  </Stack>
                  <Typography variant='body1' sx={{ color: palette.text.primary, mb: 3, flex: 1 }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: palette.text.primary }}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant='caption' sx={{ color: palette.text.tertiary }}>
                      {testimonial.company}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 10, bgcolor: palette.surface }}>
        <Container maxWidth='md'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Badge label='CONTACT' sx={{ mb: 2 }} />
            <Typography variant='h3' sx={{ fontWeight: 700, color: palette.text.primary, mb: 2 }}>
              Let's Talk About Your Fleet
            </Typography>
            <Typography variant='body1' sx={{ color: palette.text.secondary, fontSize: '18px' }}>
              Get in touch to see how Trucker'sCall can transform your fleet management
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 5,
              borderRadius: '16px',
              border: `1px solid ${palette.border}`,
              boxShadow: 'none',
              bgcolor: palette.background
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleFormChange('name')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: palette.brand.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange('email')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: palette.brand.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={formData.company}
                    onChange={handleFormChange('company')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: palette.brand.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={handleFormChange('phone')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: palette.brand.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tell us about your fleet needs"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange('message')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: palette.brand.primary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.demo}
                        onChange={handleFormChange('demo')}
                        sx={{
                          color: palette.neutral[400],
                          '&.Mui-checked': {
                            color: palette.brand.primary,
                          },
                        }}
                      />
                    }
                    label="I would like to schedule a demo"
                    sx={{ color: palette.text.secondary }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center'>
                    <PrimaryButton
                      type="submit"
                      size='large'
                      sx={{ px: 5 }}
                    >
                      Send Message
                    </PrimaryButton>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Contact Info */}
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: palette.brand.primaryLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Icon icon='tabler:phone' fontSize={24} style={{ color: palette.brand.primary }} />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 600, color: palette.text.primary, mb: 1 }}>
                  Call Us
                </Typography>
                <Typography variant='body2' sx={{ color: palette.text.secondary }}>
                  +1 (424) 480-7774
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: palette.brand.primaryLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Icon icon='tabler:mail' fontSize={24} style={{ color: palette.brand.primary }} />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 600, color: palette.text.primary, mb: 1 }}>
                  Email Us
                </Typography>
                <Typography variant='body2' sx={{ color: palette.text.secondary }}>
                  contact@truckerscall.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: palette.brand.primaryLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Icon icon='tabler:clock' fontSize={24} style={{ color: palette.brand.primary }} />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 600, color: palette.text.primary, mb: 1 }}>
                  Office Hours
                </Typography>
                <Typography variant='body2' sx={{ color: palette.text.secondary }}>
                  Mon-Fri: 9AM-6PM EST
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: palette.neutral[900] }}>
        <Container maxWidth='md'>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h3' sx={{ fontWeight: 700, color: palette.background, mb: 3 }}>
              Ready to modernize your fleet management?
            </Typography>
            <Typography variant='h6' sx={{ color: palette.neutral[400], mb: 5, fontWeight: 400 }}>
              Join forward-thinking companies saving hours every day
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center'>
              <Button
                onClick={() => scrollToSection('contact')}
                variant='contained'
                size='large'
                sx={{
                  bgcolor: palette.background,
                  color: palette.text.primary,
                  px: 4,
                  '&:hover': {
                    bgcolor: palette.neutral[100]
                  }
                }}
              >
                Let's Talk
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant='outlined'
                size='large'
                sx={{
                  color: palette.background,
                  borderColor: palette.neutral[700],
                  px: 4,
                  '&:hover': {
                    borderColor: palette.neutral[600],
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Schedule demo
              </Button>
            </Stack>

          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: palette.background, borderTop: `1px solid ${palette.border}` }}>
        <Container maxWidth='lg'>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: palette.text.primary, mb: 2 }}>
                Trucker'sCall
              </Typography>
              <Typography variant='body2' sx={{ color: palette.text.secondary, mb: 3 }}>
                Modern fleet management for the digital age.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction='row' spacing={3} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Link href='/privacy' style={{ color: palette.text.tertiary, textDecoration: 'none', fontSize: '12px' }}>
                  Privacy Policy
                </Link>
                <Link href='/terms' style={{ color: palette.text.tertiary, textDecoration: 'none', fontSize: '12px' }}>
                  Terms of Service
                </Link>
                <Link href='/cookies' style={{ color: palette.text.tertiary, textDecoration: 'none', fontSize: '12px' }}>
                  Cookie Policy
                </Link>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='caption' sx={{ color: palette.text.tertiary }}>
              © 2024 Trucker'sCall. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  )
}

// Critical configuration
HomePage.getLayout = page => <BlankLayout>{page}</BlankLayout>
HomePage.authGuard = false
HomePage.guestGuard = false

export default HomePage
