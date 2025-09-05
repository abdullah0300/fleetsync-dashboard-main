// pages/privacy.js

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Divider,
  Paper,
  useMediaQuery
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'
import Grid from '@mui/material/Grid'
// Color Palette (same as landing page)
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

const PolicySection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& h2': {
    color: palette.text.primary,
    marginBottom: theme.spacing(3),
    fontSize: '28px',
    fontWeight: 700
  },
  '& h3': {
    color: palette.text.primary,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontSize: '20px',
    fontWeight: 600
  },
  '& p': {
    marginBottom: theme.spacing(2),
    lineHeight: 1.8,
    color: palette.text.secondary,
    fontSize: '16px'
  },
  '& ul': {
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  '& li': {
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.7,
    color: palette.text.secondary,
    fontSize: '16px'
  }
}))

const PrivacyPolicyPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const effectiveDate = "January 15, 2025"

  return (
    <>
      {/* Navigation */}
      <NavBar scrolled={scrolled}>
        <Container maxWidth='lg'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction='row' spacing={6} alignItems='center'>
              <Box
                onClick={() => router.push('/')}
                sx={{ cursor: 'pointer' }}
              >
                <Image
                  src="https://ik.imagekit.io/mctozv7td/apple-touch-icon.png?updatedAt=1757084860277"
                  alt="Trucker'sCall Logo"
                  width={120}
                  height={40}
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </Box>

              {!isMobile && (
                <Stack direction='row' spacing={4}>
                  <Button
                    onClick={() => router.push('/')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={() => router.push('/#features')}
                    sx={{ color: palette.text.secondary, fontWeight: 500, fontSize: '14px' }}
                  >
                    Features
                  </Button>
                  <Button
                    onClick={() => router.push('/#contact')}
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
                  <PrimaryButton onClick={() => router.push('/#contact')}>
                    Get Started
                  </PrimaryButton>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </NavBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 15, pb: 10 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '36px', md: '48px' },
                fontWeight: 700,
                color: palette.text.primary,
                mb: 2
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: palette.text.tertiary,
                fontSize: '16px'
              }}
            >

            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '16px',
              border: `1px solid ${palette.border}`,
              bgcolor: palette.surface
            }}
          >
            <PolicySection>
              <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: 1.8, color: palette.text.secondary, mb: 4 }}>
                Trucker'sCall ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fleet management platform, including our web application and mobile application (collectively, the "Services").
              </Typography>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                1. Information We Collect
              </Typography>

              <Typography variant="h5" component="h3">
                1.1 Personal Information
              </Typography>
              <Typography paragraph>
                When you register for an account or use our Services, we may collect:
              </Typography>
              <ul>
                <li>Full name and contact information (email address, phone number)</li>
                <li>Driver's license information (number, state, expiry date)</li>
                <li>Employment information (company affiliation, role, manager details)</li>
                <li>Account credentials (username, password - stored encrypted)</li>
                <li>Profile information you choose to provide</li>
              </ul>

              <Typography variant="h5" component="h3">
                1.2 Operational Data
              </Typography>
              <Typography paragraph>
                Through your use of the Services, we collect:
              </Typography>
              <ul>
                <li>Vehicle information (VIN, registration, model, maintenance records)</li>
                <li>Trip and route data (start/end locations, mileage, duration)</li>
                <li>Driver logs and hours of service records</li>
                <li>Pre-trip and post-trip inspection data</li>
                <li>Form responses and associated documentation</li>
                <li>Photos and images uploaded for documentation purposes</li>
                <li>Location data (when you explicitly provide it for logs)</li>
              </ul>

              <Typography variant="h5" component="h3">
                1.3 Technical Information
              </Typography>
              <Typography paragraph>
                We automatically collect certain technical information:
              </Typography>
              <ul>
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Log data (IP address, access times, pages viewed, app crashes)</li>
                <li>Usage data (features used, frequency of use, performance data)</li>
                <li>Network carrier information</li>
              </ul>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                2. How We Use Your Information
              </Typography>
              <Typography paragraph>
                We use the collected information to:
              </Typography>
              <ul>
                <li>Provide, operate, and maintain our Services</li>
                <li>Create and manage your account</li>
                <li>Process and complete transactions</li>
                <li>Enable communication between drivers, managers, and administrators</li>
                <li>Send administrative information, updates, and security alerts</li>
                <li>Monitor compliance with hours of service regulations</li>
                <li>Generate reports and analytics for fleet management</li>
                <li>Respond to customer service requests and support needs</li>
                <li>Improve and personalize user experience</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                3. Data Sharing and Disclosure
              </Typography>

              <Typography variant="h5" component="h3">
                3.1 Within Your Organization
              </Typography>
              <Typography paragraph>
                Information is shared within your company's account structure:
              </Typography>
              <ul>
                <li>Managers can access data for drivers they supervise</li>
                <li>Company administrators can access all company-related data</li>
                <li>Drivers can access their own data and assigned vehicle information</li>
              </ul>

              <Typography variant="h5" component="h3">
                3.2 Service Providers
              </Typography>
              <Typography paragraph>
                We may share information with third-party service providers who assist us in:
              </Typography>
              <ul>
                <li>Cloud storage and hosting services</li>
                <li>Data analytics and performance monitoring</li>
                <li>Customer support services</li>
                <li>Payment processing (if applicable)</li>
              </ul>

              <Typography variant="h5" component="h3">
                3.3 Legal Requirements
              </Typography>
              <Typography paragraph>
                We may disclose information when required to:
              </Typography>
              <ul>
                <li>Comply with applicable laws, regulations, or legal processes</li>
                <li>Respond to lawful requests from public authorities</li>
                <li>Protect our rights, privacy, safety, or property</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                4. Data Security
              </Typography>
              <Typography paragraph>
                We implement appropriate technical and organizational security measures:
              </Typography>
              <ul>
                <li>Encryption of data in transit using TLS/SSL protocols</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Secure password storage using industry-standard hashing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                5. Your Rights
              </Typography>
              <Typography paragraph>
                You have the right to:
              </Typography>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </PolicySection>

            <PolicySection>
              <Typography variant="h4" component="h2">
                6. Contact Us
              </Typography>
              <Typography paragraph>
                If you have questions or concerns about this Privacy Policy, please contact us:
              </Typography>
              <Box sx={{ pl: 3, mt: 3 }}>
                <Typography sx={{ mb: 1 }}><strong>Trucker'sCall Support Team</strong></Typography>
                <Typography sx={{ mb: 1 }}>Email: contact@truckerscall.com</Typography>
              </Box>
            </PolicySection>
          </Paper>
        </Box>
      </Container>

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
                <Link href='/privacy' style={{ color: palette.brand.primary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                  Privacy Policy
                </Link>
                <Link href='/terms' style={{ color: palette.text.tertiary, textDecoration: 'none', fontSize: '14px' }}>
                  Terms of Service
                </Link>
                <Link href='/cookies' style={{ color: palette.text.tertiary, textDecoration: 'none', fontSize: '14px' }}>
                  Cookie Policy
                </Link>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='caption' sx={{ color: palette.text.tertiary }}>
              © 2025 Trucker'sCall. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  )
}

// Critical configuration
PrivacyPolicyPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
PrivacyPolicyPage.authGuard = false
PrivacyPolicyPage.guestGuard = false

export default PrivacyPolicyPage
