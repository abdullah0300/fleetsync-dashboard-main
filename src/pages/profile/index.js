import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// MUI
import { Card, CardContent, CardHeader, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

// Custom
import CustomTextField from 'src/@core/components/mui/text-field'

// Auth hook
import { useAuth } from 'src/hooks/useAuth'

// API
import axios from 'axios'

const ProfileForm = () => {
  const { user } = useAuth()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    contactPhone: '',
    dateOfBirth: null
  }

  const passwordDefaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const { control, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  })

  const { control: passwordControl, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm({
    defaultValues: passwordDefaultValues
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.fullName?.firstName || '',
        lastName: user.fullName?.lastName || '',
        email: user.email || '',
        contactPhone: user.contactPhone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)

      const formData = {
        fullName: {
          firstName: data.firstName,
          lastName: data.lastName
        },
        contactPhone: data.contactPhone,
        dateOfBirth: data.dateOfBirth
      }

      const storedToken = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('New passwords do not match')
        
return
      }

      setIsSubmitting(true)

      const formData = {
        currentPassword: data.currentPassword,
        password: data.newPassword
      }

      const storedToken = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      toast.success('Password updated successfully')
      setIsPasswordDialogOpen(false)
      resetPassword()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title='My Profile'
        action={
          <Button variant='contained' onClick={() => setIsPasswordDialogOpen(true)}>
            Change Password
          </Button>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Email (read-only) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Email'
                    type='email'
                    {...field}
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            </Grid>

            {/* Contact Phone */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='contactPhone'
                control={control}
                rules={{
                  required: 'Contact phone is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Contact Phone'
                    placeholder='1234567890'
                    error={Boolean(errors.contactPhone)}
                    helperText={errors.contactPhone?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='dateOfBirth'
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Select date of birth"
                    className="form-control"
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    customInput={
                      <CustomTextField
                        fullWidth
                        label='Date of Birth'
                        error={Boolean(errors.dateOfBirth)}
                        helperText={errors.dateOfBirth?.message}
                      />
                    }
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name='currentPassword'
                  control={passwordControl}
                  rules={{ required: 'Current password is required' }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Current Password'
                      type='password'
                      error={Boolean(errors.currentPassword)}
                      helperText={errors.currentPassword?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='newPassword'
                  control={passwordControl}
                  rules={{
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='New Password'
                      type='password'
                      error={Boolean(errors.newPassword)}
                      helperText={errors.newPassword?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='confirmPassword'
                  control={passwordControl}
                  rules={{ required: 'Please confirm your password' }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Confirm Password'
                      type='password'
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            <Button
              type='submit'
              variant='contained'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default ProfileForm
