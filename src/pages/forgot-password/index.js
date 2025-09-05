import Link from 'next/link'
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ✅ Form + Validation
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

// FleetSeek brand colors
const primaryColor = '#e63946' // Primary red
const secondaryColor = '#457b9d' // Secondary blue
const darkBlueColor = '#1d3557' // Dark blue
const lightBlueColor = '#a8dadc' // Light blue
const offWhiteColor = '#f1faee' // Off-white

// ✅ Yup schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required')
})

const ForgotPassword = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ✅ Local state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong')
      }

      setMessage('Password reset link sent to your email. Please Check')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const RightWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: 450
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 600
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: 750
    }
  }))

  const LinkStyled = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    justifyContent: 'center',
    color: secondaryColor,
    fontSize: theme.typography.body1.fontSize,
    '&:hover': {
      color: primaryColor
    }
  }))

  const FleetSeekButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#ffffff',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#c62b37',
      boxShadow: '0 8px 15px rgba(230, 57, 70, 0.2)'
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(230, 57, 70, 0.5)',
      color: 'rgba(255, 255, 255, 0.7)'
    }
  }))

  const FleetSeekTextField = styled(CustomTextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.1)'
      },
      '&:hover fieldset': {
        borderColor: secondaryColor
      },
      '&.Mui-focused fieldset': {
        borderColor: primaryColor
      }
    },
    '& .MuiInputLabel-root': {
      color: darkBlueColor,
      '&.Mui-focused': {
        color: primaryColor
      }
    },
    '& .MuiFormHelperText-root': {
      color: primaryColor
    }
  }))

  return (
    <Box className='content-right' sx={{ backgroundColor: offWhiteColor }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: lightBlueColor,
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <img
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
            style={{ zIndex: 2, maxHeight: 500, marginTop: theme.spacing(12), marginBottom: theme.spacing(12) }}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography
                sx={{ mb: 1.5, fontWeight: 700, fontSize: '1.625rem', lineHeight: 1.385, color: darkBlueColor }}
              >
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: secondaryColor }}>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FleetSeekTextField
                fullWidth
                autoFocus
                type='email'
                label='Email'
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={{ display: 'flex', mb: 4 }}
              />

              <FleetSeekButton fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </FleetSeekButton>

              {message && <Typography sx={{ mb: 2, color: '#2ecc71', fontWeight: 500 }}>{message}</Typography>}
              {error && <Typography sx={{ mb: 2, color: primaryColor, fontWeight: 500 }}>{error}</Typography>}

              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' color={secondaryColor} />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
