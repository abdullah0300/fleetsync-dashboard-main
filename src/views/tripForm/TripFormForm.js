// views/tripForm/TripFormForm.js
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CardHeader, FormControlLabel, Grid, MenuItem, Switch } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import QuestionBuilder from './QuestionBuilder'

const schema = yup.object().shape({
  formName: yup.string().required('Form name is required'),
  managerId: yup.string().required('Manager is required'),
  isActive: yup.boolean(),
  questions: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question text is required'),
      type: yup.string().oneOf(['YesNo', 'TextInput']).required(),
      order: yup.number().min(1),
      isRequired: yup.boolean()
    })
  )
})

const TripFormForm = ({ onSubmitForm, managers, defaultValues = null, currentUser = {}, isRestricted = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: defaultValues || {
      // managerId: '',
      managerId: isRestricted ? currentUser.id : '',
      formName: '',
      isActive: true,
      questions: []
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const payload = {
      ...data,
      questions: data.questions.map((q, i) => ({ ...q, order: i + 1 }))
    }
    onSubmitForm(payload)
  }

  return (
    <Card>
      <CardHeader title={defaultValues ? 'Edit Trip Form' : 'Create Trip Form'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {!isRestricted && (

              /* Manager Dropdown */
              <Grid item xs={12} sm={6}>
                <Controller
                  name='managerId'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Manager'
                      {...field}
                      error={!!errors.managerId}
                      helperText={errors.managerId?.message}
                    >
                      {managers.map(manager => (
                        <MenuItem key={manager._id} value={manager._id}>
                          {manager.fullName.firstName} {manager.fullName.lastName}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}

            {/* Form Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='formName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Form Name'
                    {...field}
                    error={!!errors.formName}
                    helperText={errors.formName?.message}
                  />
                )}
              />
            </Grid>

            {/* Active Toggle */}
            <Grid item xs={12}>
              <Controller
                name='isActive'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Active' />
                )}
              />
            </Grid>

            {/* Questions */}
            <Grid item xs={12}>
              <QuestionBuilder control={control} errors={errors} />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button variant='contained' type='submit'>
                {defaultValues ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TripFormForm
