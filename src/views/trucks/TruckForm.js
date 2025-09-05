import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CardHeader, FormControlLabel, Grid, MenuItem, Switch } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'

const TruckForm = ({
  truckData = null,
  companies = [],
  managers = [],
  drivers = [],
  tripForms = [],
  onSubmitForm,
  currentUser = {},
  isRestricted = false
}) => {
  const defaultValues = {
    vin: '',
    model: '',
    regNumber: '',
    trailerType: '',
    truckType: '',

    // companyId: '',
    companyId: isRestricted ? currentUser.companyId : '',

    // managedByManagerId: '',
    managedByManagerId: isRestricted ? currentUser.id : '',
    formId: '',
    driverId: '',
    assignmentDate: '',
    lastMaintenanceDate: '',
    lastMaintenanceMileage: '',
    nextMaintenanceDate: '',
    nextMaintenanceMileage: '',
    maxMileageLimit: '',
    currentAccumulatedMileage: '',
    sendAlerts: true,
    isActive: true
  }

  const truckSchema = yup.object().shape({
    vin: yup.string().required('VIN is required'),
    model: yup.string().required('Model is required'),
    regNumber: yup.string().required('Registration number is required'),
    trailerType: yup.string().required('Trailer type is required'),
    truckType: yup.string().required('Truck type is required'),
    companyId: yup.string().required('Company is required'),
    managedByManagerId: yup.string().required('Manager is required'),
    formId: yup.string(),
    driverId: yup.string(),
    assignmentDate: yup.date(),
    lastMaintenanceDate: yup.date().required('Last maintenance date is required'),
    lastMaintenanceMileage: yup
      .number()
      .typeError('Mileage must be a number')
      .required('Last maintenance mileage is required'),
    nextMaintenanceDate: yup.date().required('Next maintenance date is required'),
    nextMaintenanceMileage: yup
      .number()
      .typeError('Mileage must be a number')
      .required('Next maintenance mileage is required'),
    maxMileageLimit: yup.number().typeError('Mileage must be a number').required('Max mileage limit is required'),
    currentAccumulatedMileage: yup
      .number()
      .typeError('Mileage must be a number')
      .required('Current accumulated mileage is required'),
    sendAlerts: yup.boolean(),
    isActive: yup.boolean()
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(truckSchema)
  })

  const onSubmit = data => {
    console.log(data)

    const formattedData = {
      vin: data.vin,
      model: data.model,
      regNumber: data.regNumber,
      trailerType: data.trailerType,
      truckType: data.truckType,
      companyId: data.companyId,
      ...(data.formId && { formId: data.formId }),
      managedByManagerId: data.managedByManagerId,
      maintenanceInfo: {
        lastMaintenanceDate: data.lastMaintenanceDate,
        lastMaintenanceMileage: data.lastMaintenanceMileage,
        nextMaintenanceDate: data.nextMaintenanceDate,
        nextMaintenanceMileage: data.nextMaintenanceMileage
      },
      limitedMileage: {
        sendAlerts: data.sendAlerts,
        maxMileageLimit: data.maxMileageLimit,
        currentAccumulatedMileage: data.currentAccumulatedMileage
      },
      ...(data.driverId && {
        assignedDrivers: {
          mainDriver: {
            driverId: data.driverId,
            assignmentDate: data.assignmentDate
          }
        }
      }),
      isActive: data.isActive
    }

    onSubmitForm?.(formattedData)
  }

  const trailerTypes = ['Flatbed', 'Dry Van', 'Refrigerated', 'Tanker', 'Lowboy', 'Container', 'Dump', 'Other']
  const truckTypes = ['Tractor', 'Straight Truck', 'Box Truck', 'Pickup', 'Other']

  // Reset on edit
  useEffect(() => {
    if (truckData) {
      const normalizedData = {
        vin: truckData.vin || '',
        model: truckData.model || '',
        regNumber: truckData.regNumber || '',
        trailerType: truckData.trailerType || '',
        truckType: truckData.truckType || '',
        companyId: truckData.companyId?._id || '',
        managedByManagerId: truckData.managedByManagerId?._id || '',
        formId: truckData.formId?._id || '',
        driverId: truckData.assignedDrivers?.mainDriver?.driverId?._id || '',
        assignmentDate: truckData.assignedDrivers?.mainDriver?.assignmentDate?.substring(0, 10) || '',
        lastMaintenanceDate: truckData.maintenanceInfo?.lastMaintenanceDate?.substring(0, 10) || '',
        lastMaintenanceMileage: truckData.maintenanceInfo?.lastMaintenanceMileage || '',
        nextMaintenanceDate: truckData.maintenanceInfo?.nextMaintenanceDate?.substring(0, 10) || '',
        nextMaintenanceMileage: truckData.maintenanceInfo?.nextMaintenanceMileage || '',
        maxMileageLimit: truckData.limitedMileage?.maxMileageLimit || '',
        currentAccumulatedMileage: truckData.limitedMileage?.currentAccumulatedMileage || '',
        sendAlerts: truckData.limitedMileage?.sendAlerts ?? true,
        isActive: truckData.isActive ?? true
      }

      reset(normalizedData)
    }
  }, [truckData, reset])

  return (
    <Card>
      <CardHeader title={truckData ? 'Edit Truck' : 'Add Truck'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* VIN */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='vin'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='VIN'
                    {...field}
                    error={!!errors.vin}
                    helperText={errors.vin?.message}
                  />
                )}
              />
            </Grid>

            {/* Model */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='model'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Model'
                    {...field}
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                )}
              />
            </Grid>

            {/* Registration Number */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='regNumber'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Reg. Number'
                    {...field}
                    error={!!errors.regNumber}
                    helperText={errors.regNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Trailer Type */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='trailerType'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Trailer Type'
                    {...field}
                    error={!!errors.trailerType}
                    helperText={errors.trailerType?.message}
                  >
                    {trailerTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Truck Type */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='truckType'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Truck Type'
                    {...field}
                    error={!!errors.truckType}
                    helperText={errors.truckType?.message}
                  >
                    {truckTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Company */}
            {!isRestricted && (
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
                      {companies.map(c => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.companyName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Manager */}
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
                      {managers.map(m => (
                        <MenuItem key={m._id} value={m._id}>
                          {m.fullName?.firstName} {m.fullName?.lastName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Driver */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='driverId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Main Driver'
                    {...field}
                    error={!!errors?.driverId}
                    helperText={errors?.driverId?.message}
                  >
                    {drivers.map(d => (
                      <MenuItem key={d._id} value={d._id}>
                        {d.fullName?.firstName} {d.fullName?.lastName}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='formId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Trip Form'
                    {...field}
                    error={!!errors.formId}
                    helperText={errors.formId?.message}
                  >
                    {tripForms.map(f => (
                      <MenuItem key={f._id} value={f._id}>
                        {f.formName}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Assignment Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='assignmentDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Assignment Date'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors?.assignmentDate}
                    helperText={errors?.assignmentDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Maintenance Dates */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastMaintenanceDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Last Maintenance'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors?.lastMaintenanceDate}
                    helperText={errors?.lastMaintenanceDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nextMaintenanceDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Next Maintenance'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors?.nextMaintenanceDate}
                    helperText={errors?.nextMaintenanceDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Mileage Fields */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastMaintenanceMileage'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Last Maintenance Mileage'
                    {...field}
                    error={!!errors?.lastMaintenanceMileage}
                    helperText={errors?.lastMaintenanceMileage?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nextMaintenanceMileage'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Next Maintenance Mileage'
                    {...field}
                    error={!!errors?.nextMaintenanceMileage}
                    helperText={errors?.nextMaintenanceMileage?.message}
                  />
                )}
              />
            </Grid>

            {/* Limited Mileage Section */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='maxMileageLimit'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Max Mileage Limit'
                    {...field}
                    error={!!errors?.maxMileageLimit}
                    helperText={errors?.maxMileageLimit?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='currentAccumulatedMileage'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Current Accumulated Mileage'
                    {...field}
                    error={!!errors?.currentAccumulatedMileage}
                    helperText={errors?.currentAccumulatedMileage?.message}
                  />
                )}
              />
            </Grid>

            {/* Alert Switch */}
            <Grid item xs={12}>
              <Controller
                name='sendAlerts'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={onChange} />}
                    label='Send Alerts for Mileage'
                  />
                )}
              />
            </Grid>

            {/* Active Switch */}
            <Grid item xs={12}>
              <Controller
                name='isActive'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label='Active Truck' />
                )}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                {truckData ? 'Update Truck' : 'Add Truck'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TruckForm
