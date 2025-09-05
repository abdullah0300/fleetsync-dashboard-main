import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// MUI
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch
} from '@mui/material'

// Custom
import CustomTextField from 'src/@core/components/mui/text-field'

// Hook form & validation
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

// Icon
import Icon from 'src/@core/components/icon'

const UserForm = ({ userData = null, onSubmitForm, companies = [], currentUser = {}, isRestricted = false }) => {
  const router = useRouter()

  // === Default Form Values ===
  const defaultValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: isRestricted ? 'Driver' : '',
    companyId: isRestricted ? currentUser.companyId : '',
    isActive: true,
    contactPhone: '',
    dateOfBirth: ''
  }

  // === Validation Schema ===
  const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) return `${field} is required`
    else if (valueLen < min) return `${field} must be at least ${min} characters`

    return ''
  }

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().when('$isEdit', {
      is: true,
      then: schema => schema.notRequired(),
      otherwise: schema => schema.min(8, 'Password must be at least 8 characters').required('Password is required')
    }),
    firstName: yup
      .string()
      .min(3, obj => showErrors('firstName', obj.value.length, obj.min))
      .required(),
    lastName: yup
      .string()
      .min(3, obj => showErrors('lastName', obj.value.length, obj.min))
      .required(),
    role: yup.string().required('Role is required'),
    companyId: yup.string().when('role', {
      is: val => val === 'Manager' || val === 'Driver',
      then: schema => schema.required('Company ID is required for Managers and Drivers'),
      otherwise: schema => schema.notRequired()
    }),
    isActive: yup.boolean(),
    contactPhone: yup
      .string()
      .matches(/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number')
      .required('Contact phone is required')
  })

  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',

    // resolver: yupResolver(schema)
    context: { isEdit: !!userData }, // ✅ context goes here now
    resolver: yupResolver(schema)
  })

  const selectedRole = useWatch({ control, name: 'role' })

  // === Fill form if editing ===
  useEffect(() => {
    if (userData) {
      // Format date if it exists
      const formattedDate = userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : ''

      reset({
        email: userData.email || '',
        password: '',
        firstName: userData.fullName?.firstName || '',
        lastName: userData.fullName?.lastName || '',
        role: isRestricted ? 'Driver' : userData.role,
        companyId: isRestricted ? currentUser.companyId : userData.companyId,
        isActive: userData.isActive ?? true,
        contactPhone: userData.contactPhone || '',
        dateOfBirth: formattedDate
      })
    }
  }, [userData, reset])

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const onSubmit = data => {
    const formattedData = {
      email: data.email,
      password: data.password,
      role: data.role,
      isActive: data.isActive,
      fullName: {
        firstName: data.firstName,
        lastName: data.lastName
      },
      contactPhone: data.contactPhone,
      dateOfBirth: undefined
    }

    // Include companyId only if present and valid
    if (data.companyId) {
      formattedData.companyId = data.companyId
    }

    onSubmitForm?.(formattedData)

    // toast.success(userData ? 'User updated successfully' : 'User created successfully')
  }

  return (
    <Card>
      <CardHeader title={userData ? 'Edit User' : 'Create User'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    {...field}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    {...field}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Email'
                    type='email'
                    placeholder='john.doe@example.com'
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      readOnly: !!userData // Make it readonly if editing
                    }}
                  />
                )}
              />
            </Grid>

            {/* Password */}
            {!userData && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={handleClickShowPassword}>
                              <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Role */}
            {!isRestricted && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Role'
                      {...field}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                    >
                      <MenuItem value='SuperAdmin'>Super Admin</MenuItem>
                      <MenuItem value='Manager'>Manager</MenuItem>
                      <MenuItem value='Driver'>Driver</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Company ID */}
            {!isRestricted && selectedRole !== 'SuperAdmin' && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name='companyId'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Company'
                      {...field}
                      error={!!errors.companyId}
                      helperText={errors.companyId?.message}
                    >
                      {companies.map(company => (
                        <MenuItem key={company._id} value={company._id}>
                          {company.companyName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Contact Phone */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='contactPhone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Contact Phone'
                    placeholder='+1 (555) 123-4567'
                    {...field}
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone?.message}
                  />
                )}
              />
            </Grid>

            {/* Date of Birth */}
            {/*<Grid item xs={12} sm={6}>
              <Controller
                name='dateOfBirth'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    label='Date of Birth'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>*/}

            {/* Active Toggle */}
            <Grid item xs={12}>
              <Controller
                name='isActive'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label='Active User' />
                )}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                {userData ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserForm
