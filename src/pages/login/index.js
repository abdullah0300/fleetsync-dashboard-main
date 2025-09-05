// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** FleetSeek Theme Colors
const fleetSeekColors = {
  primary: '#e63946',
  secondary: '#457b9d',
  darkBlue: '#1d3557',
  lightBlue: '#a8dadc',
  offWhite: '#f1faee',
  darkGray: '#2A2A2A'
}

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

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
  textDecoration: 'none',
  color: `${fleetSeekColors.primary} !important`,
  fontWeight: 600,
  '&:hover': {
    textDecoration: 'underline'
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: fleetSeekColors.darkGray,
    fontFamily: 'Inter, sans-serif'
  },
  '& .MuiCheckbox-root': {
    color: fleetSeekColors.secondary
  },
  '& .Mui-checked': {
    color: `${fleetSeekColors.primary} !important`
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  email: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: fleetSeekColors.offWhite }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: fleetSeekColors.lightBlue,
            margin: theme => theme.spacing(8, 0, 8, 8),
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <LoginIllustration
            alt='FleetSeek login illustration'
            src='/images/pages/auth-v2-login-illustration-light.png'
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              textAlign: 'center',
              width: '80%'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                color: fleetSeekColors.darkBlue,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                mb: 2
              }}
            >
              Intelligent Trucking Management
            </Typography>
            <Typography
              sx={{
                color: fleetSeekColors.darkGray,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Streamline workflows, boost efficiency, and make data-driven decisions with our powerful all-in-one
              platform.
            </Typography>
          </Box>
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
            <img
              src='/images/logo/fleet-seek-logo.png'
              alt='FleetSeek Logo'
              style={{ height: '150px', marginBottom: '20px' }}
            />
            <Box sx={{ my: 6 }}>
              <Typography
                variant='h3'
                sx={{
                  mb: 1.5,
                  color: fleetSeekColors.darkBlue,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {`Welcome to Trucker\'sCall! 👋`}
              </Typography>
              <Typography
                sx={{
                  color: fleetSeekColors.darkGray,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Please sign-in to your account
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='yourname@company.com'
                      error={Boolean(errors.email)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: fleetSeekColors.secondary
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: fleetSeekColors.primary
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: fleetSeekColors.primary
                        },
                        fontFamily: 'Inter, sans-serif'
                      }}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: fleetSeekColors.secondary
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: fleetSeekColors.primary
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: fleetSeekColors.primary
                        },
                        fontFamily: 'Inter, sans-serif'
                      }}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography component={LinkStyled} href='/forgot-password'>
                  Forgot Password?
                </Typography>
              </Box>
              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{
                  mb: 4,
                  bgcolor: fleetSeekColors.primary,
                  '&:hover': {
                    bgcolor: '#d32f2f' // Darker shade of primary red
                  },
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  padding: '10px 0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Login
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: fleetSeekColors.darkGray, fontFamily: 'Inter, sans-serif' }}>
                  New to FleetSeek? <LinkStyled href='/register'>Create an account</LinkStyled>
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
