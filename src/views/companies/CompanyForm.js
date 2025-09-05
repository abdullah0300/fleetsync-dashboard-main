// src/views/companies/CompanyForm.js

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CardHeader, FormControlLabel, Grid, MenuItem, Switch } from '@mui/material'

// import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import locationData from 'src/data/locationData.json'

const defaultValues = {
  companyName: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  contactEmail: '',
  contactPhone: '',
  paymentArrangement: {
    planType: '',
    amountPaid: '',
    billingCycle: '',
    nextBillingDate: ''
  },
  truckQuota: '',
  isActive: true
}

const companySchema = yup.object().shape({
  companyName: yup.string().min(2).max(100).required('Company name is required'),

  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip Code is required'),
    country: yup.string().required('Country is required')
  }),

  contactEmail: yup.string().email('Must be a valid email').required('Contact email is required'),

  contactPhone: yup
    .string()
    .required('Contact phone is required')
    .test('is-valid-phone', 'Must be a valid phone number', value => /^\+?[\d\s\-()]{10,15}$/.test(value)),

  paymentArrangement: yup.object().shape({
    planType: yup.string().required('Plan type is required'),
    amountPaid: yup
      .number()
      .typeError('Amount must be a number')
      .min(0, 'Amount must be positive')
      .required('Amount paid is required'),
    billingCycle: yup
      .string()
      .oneOf(['Monthly', 'Annually'], 'Billing cycle must be Monthly or Annually')
      .required('Billing cycle is required'),
    nextBillingDate: yup.date().typeError('Next billing date is required').required('Next billing date is required')
  }),

  truckQuota: yup
    .number()
    .typeError('Truck quota must be a number')
    .integer('Truck quota must be an integer')
    .min(1, 'Truck quota must be at least 1')
    .required('Truck quota is required'),

  isActive: yup.boolean()
})

const CompanyForm = ({ companyData = null, onSubmitForm }) => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [availableStates, setAvailableStates] = useState([])
  const [availableCities, setAvailableCities] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(companySchema)
  })

  const watchedCountry = watch('address.country')
  const watchedState = watch('address.state')

  // Handle country change
  useEffect(() => {
    if (watchedCountry) {
      setSelectedCountry(watchedCountry)
      const countryData = locationData[watchedCountry]
      if (countryData) {
        setAvailableStates(countryData.states)
        setValue('address.state', '')
        setValue('address.city', '')
        setSelectedState('')
        setAvailableCities([])
      }
    } else {
      setSelectedCountry('')
      setAvailableStates([])
      setAvailableCities([])
    }
  }, [watchedCountry, setValue])

  // Handle state change
  useEffect(() => {
    if (watchedState && selectedCountry) {
      setSelectedState(watchedState)
      const countryData = locationData[selectedCountry]
      if (countryData && countryData.cities[watchedState]) {
        setAvailableCities(countryData.cities[watchedState])
        setValue('address.city', '')
      }
    } else {
      setSelectedState('')
      setAvailableCities([])
    }
  }, [watchedState, selectedCountry, setValue])

  useEffect(() => {
    if (companyData) {
      reset({
        ...companyData,
        paymentArrangement: {
          ...companyData.paymentArrangement,
          nextBillingDate: companyData.paymentArrangement?.nextBillingDate
            ? companyData.paymentArrangement.nextBillingDate
            : ''
        }
      })

      // Set the dropdown states for existing data
      if (companyData.address?.country) {
        setSelectedCountry(companyData.address.country)
        const countryData = locationData[companyData.address.country]
        if (countryData) {
          setAvailableStates(countryData.states)
          if (companyData.address?.state) {
            setSelectedState(companyData.address.state)
            if (countryData.cities[companyData.address.state]) {
              setAvailableCities(countryData.cities[companyData.address.state])
            }
          }
        }
      }
    }
  }, [companyData, reset])

  const onSubmit = data => {
    onSubmitForm?.(data)
  }

  // Get available countries
  const availableCountries = Object.keys(locationData).map(code => ({
    code,
    name: locationData[code].name
  }))

  return (
    <Card>
      <CardHeader title={companyData ? 'Edit Company' : 'Create Company'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Company Name */}
            <Grid item xs={12}>
              <Controller
                name='companyName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Company Name'
                    {...field}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />
                )}
              />
            </Grid>

            {/* Street Address */}
            <Grid item xs={12}>
              <Controller
                name='address.street'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Street Address'
                    {...field}
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>

            {/* Country Dropdown */}
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.country'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Country'
                    {...field}
                    error={!!errors.address?.country}
                    helperText={errors.address?.country?.message}
                  >
                    <MenuItem value=''>
                      <em>Select a country</em>
                    </MenuItem>
                    {availableCountries.map(country => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* State/Province Dropdown */}
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.state'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='State/Province'
                    {...field}
                    disabled={!selectedCountry}
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
                  >
                    <MenuItem value=''>
                      <em>Select a state</em>
                    </MenuItem>
                    {availableStates.map(state => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* City Dropdown */}
            <Grid item xs={12} sm={4}>
              <Controller
                name='address.city'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='City'
                    {...field}
                    disabled={!selectedState}
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  >
                    <MenuItem value=''>
                      <em>Select a city</em>
                    </MenuItem>
                    {availableCities.map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Zip Code */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='address.zipCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Zip Code'
                    {...field}
                    error={!!errors.address?.zipCode}
                    helperText={errors.address?.zipCode?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='contactEmail'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Contact Email'
                    type='email'
                    {...field}
                    error={!!errors.contactEmail}
                    helperText={errors.contactEmail?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Phone */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='contactPhone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Contact Phone'
                    {...field}
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone?.message}
                  />
                )}
              />
            </Grid>

            {/* Payment Arrangement */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='paymentArrangement.planType'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Plan Type'
                    {...field}
                    error={!!errors.paymentArrangement?.planType}
                    helperText={errors.paymentArrangement?.planType?.message}
                  >
                    <MenuItem value='Basic'>Basic</MenuItem>
                    <MenuItem value='Premium'>Premium</MenuItem>
                    <MenuItem value='Enterprise'>Enterprise</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='paymentArrangement.amountPaid'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Amount Paid'
                    type='number'
                    {...field}
                    error={!!errors.paymentArrangement?.amountPaid}
                    helperText={errors.paymentArrangement?.amountPaid?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='paymentArrangement.billingCycle'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Billing Cycle'
                    {...field}
                    error={!!errors.paymentArrangement?.billingCycle}
                    helperText={errors.paymentArrangement?.billingCycle?.message}
                  >
                    <MenuItem value='Monthly'>Monthly</MenuItem>
                    <MenuItem value='Annually'>Annually</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='paymentArrangement.nextBillingDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Next Billing Date'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...field}
                    error={!!errors.paymentArrangement?.nextBillingDate}
                    helperText={errors.paymentArrangement?.nextBillingDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Truck Quota */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='truckQuota'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Truck Quota'
                    type='number'
                    {...field}
                    error={!!errors.truckQuota}
                    helperText={errors.truckQuota?.message}
                  />
                )}
              />
            </Grid>

            {/* isActive */}
            <Grid item xs={12}>
              <Controller
                name='isActive'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label='Active Company'
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                {companyData ? 'Update Company' : 'Create Company'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CompanyForm
