// src/views/drivers/DriverForm.js

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CardHeader, Grid, MenuItem } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'

const DriverForm = ({
  onSubmitForm,
  driverData = null,
  drivers = [],
  managers = [],
  trucks = [],
  tripForms = [],
  currentUser = {},
  isRestricted = false
}) => {
  // Shared validation schema
  const baseSchema = {
    driverType: yup.string().required('Driver type is required'),
    driverLicense: yup.object().shape({
      number: yup.string().required('License number is required'),
      state: yup.string().required('License state is required'),
      expiryDate: yup.string().required('Expiry date is required')
    }),
    startDate: yup.string().required('Start date is required'),
    truckId: yup.string().required('Truck is required'),
    tripFormId: yup.string().required('Trip form is required')

    // address: yup.object().shape({
    //   street: yup.string().required('Street is required'),
    //   city: yup.string().required('City is required'),
    //   state: yup.string().required('State is required'),
    //   zipCode: yup.string().required('Zip Code is required')
    // })
  }

  // Additional fields only required on add
  const addOnlySchema = {
    userId: yup.string().required('Driver user is required'),
    managedByManagerId: yup.string().required('Manager is required')
  }

  const getValidationSchema = isEdit => yup.object().shape(isEdit ? baseSchema : { ...addOnlySchema, ...baseSchema })

  const defaultValues = {
    userId: '',
    managedByManagerId: isRestricted ? currentUser.id : '',
    driverType: '',
    driverLicense: {
      number: '',
      state: '',
      expiryDate: ''
    },
    startDate: '',
    truckId: '',
    tripFormId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  }
  const isEdit = !!driverData

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(getValidationSchema(isEdit))
  })

  useEffect(() => {
    if (driverData) {
      const normalizedData = {
        userId: driverData.userId?._id || '',
        managedByManagerId: driverData.managedByManagerId?._id || (isRestricted ? currentUser.id : ''),
        driverType: driverData.driverType || '',
        driverLicense: {
          number: driverData.driverLicense?.number || '',
          state: driverData.driverLicense?.state || '',
          expiryDate: driverData.driverLicense?.expiryDate?.substring(0, 10) || ''
        },
        startDate: driverData.startDate?.substring(0, 10) || '',
        truckId: driverData.assignedTruck?.truckId || '',
        tripFormId: driverData.assignedTruck?.formId || '',
        address: {
          street: driverData.address?.street || '',
          city: driverData.address?.city || '',
          state: driverData.address?.state || '',
          zipCode: driverData.address?.zipCode || ''
        }
      }

      reset(normalizedData)
    }
  }, [driverData, reset, isRestricted, currentUser.id])

  const onSubmit = data => {
    onSubmitForm?.(data)
  }

  return (
    <Card>
      <CardHeader title={isEdit ? 'Edit Driver' : 'Add Driver'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {!isEdit && (
              <>
                {/* Select Driver */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userId'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Driver'
                        {...field}
                        error={!!errors.userId}
                        helperText={errors.userId?.message}
                      >
                        {drivers.map(driver => (
                          <MenuItem key={driver._id} value={driver._id}>
                            {driver.fullName?.firstName} {driver.fullName?.lastName}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                {/* Select Manager */}
                {!isRestricted && (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='managedByManagerId'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label='Manager'
                          {...field}
                          error={!!errors.managedByManagerId}
                          helperText={errors.managedByManagerId?.message}
                        >
                          {managers.map(manager => (
                            <MenuItem key={manager._id} value={manager._id}>
                              {manager.fullName?.firstName} {manager.fullName?.lastName}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                )}
              </>
            )}

            {/* Driver Type */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='driverType'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Driver Type'
                    {...field}
                    error={!!errors.driverType}
                    helperText={errors.driverType?.message}
                  >
                    <MenuItem value='Full-Time'>Full-Time</MenuItem>
                    <MenuItem value='Part-Time'>Part-Time</MenuItem>
                    <MenuItem value='Regional'>Regional</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* License Number */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='driverLicense.number'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='License Number'
                    {...field}
                    error={!!errors.driverLicense?.number}
                    helperText={errors.driverLicense?.number?.message}
                  />
                )}
              />
            </Grid>

            {/* License State */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='driverLicense.state'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='License State'
                    {...field}
                    error={!!errors.driverLicense?.state}
                    helperText={errors.driverLicense?.state?.message}
                  />
                )}
              />
            </Grid>

            {/* License Expiry */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='driverLicense.expiryDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    label='License Expiry'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors.driverLicense?.expiryDate}
                    helperText={errors.driverLicense?.expiryDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='startDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    label='Start Date'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Select Truck */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='truckId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Assigned Truck'
                    {...field}
                    error={!!errors.truckId}
                    helperText={errors.truckId?.message}
                  >
                    {trucks.map(truck => (
                      <MenuItem key={truck._id} value={truck._id}>
                        {truck.regNumber}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Select Trip Form */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='tripFormId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Trip Form'
                    {...field}
                    error={!!errors.tripFormId}
                    helperText={errors.tripFormId?.message}
                  >
                    {tripForms.map(form => (
                      <MenuItem key={form._id} value={form._id}>
                        {form.formName}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Address fields commented out */}

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                {isEdit ? 'Update Driver' : 'Create Driver'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default DriverForm
