import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// React Hook Form + Validation
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// MUI
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Custom components
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// Styles
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: { maxHeight: 550 },
  [theme.breakpoints.down('lg')]: { maxHeight: 500 }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 450 },
  [theme.breakpoints.up('lg')]: { maxWidth: 600 },
  [theme.breakpoints.up('xl')]: { maxWidth: 750 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`
}))

// ✅ Yup schema
const schema = yup.object().shape({
  newPassword: yup.string().required('Password is required').min(8, 'Minimum 8 characters'),
  confirmNewPassword: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ResetPasswordV2 = () => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const token = router.query.token // get token from URL

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  })

  console.log(router);


  const onSubmit = async data => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.newPassword })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to reset password')

      setMessage('Password reset successful! Redirecting...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ResetPasswordIllustration
            alt='reset-password-illustration'
            src={`/images/pages/auth-v2-reset-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      )}

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
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Reset Password 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your new password below</Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <CustomTextField
                fullWidth
                label='New Password'
                placeholder='••••••••'
                id='newPassword'
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword?.message}
                sx={{ mb: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={() => setShowPassword(!showPassword)} onMouseDown={e => e.preventDefault()}>
                        <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <CustomTextField
                fullWidth
                label='Confirm Password'
                placeholder='••••••••'
                id='confirmNewPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                error={Boolean(errors.confirmNewPassword)}
                helperText={errors.confirmNewPassword?.message}
                sx={{ mb: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <Icon icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button fullWidth variant='contained' type='submit' disabled={loading} sx={{ mb: 4 }}>
                {loading ? 'Resetting...' : 'Set New Password'}
              </Button>

              {/* ✅ Feedback */}
              {message && <Typography sx={{ color: 'success.main', mb: 2 }}>{message}</Typography>}
              {error && <Typography sx={{ color: 'error.main', mb: 2 }}>{error}</Typography>}

              <Typography sx={{ textAlign: 'center' }}>
                <LinkStyled href='/login'>
                  <Icon icon='tabler:chevron-left' fontSize='1.25rem' />
                  Back to login
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ResetPasswordV2.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPasswordV2.guestGuard = true

export default ResetPasswordV2
