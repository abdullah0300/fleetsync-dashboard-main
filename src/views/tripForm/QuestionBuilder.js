// views/tripForm/QuestionBuilder.js
import { Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem } from '@mui/material'
import { Controller, useFieldArray } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

const QuestionBuilder = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Button
          variant='outlined'
          onClick={() => append({ question: '', type: 'YesNo', order: fields.length + 1, isRequired: false })}
        >
          Add Question
        </Button>
      </Grid>

      {fields.map((field, index) => (
        <Grid item xs={12} container spacing={2} key={field.id}>
          {/* Question Text */}
          <Grid item xs={12} sm={4}>
            <Controller
              name={`questions.${index}.question`}
              control={control}
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  label='Question'
                  {...field}
                  error={!!errors?.questions?.[index]?.question}
                  helperText={errors?.questions?.[index]?.question?.message}
                />
              )}
            />
          </Grid>

          {/* Question Type */}
          <Grid item xs={12} sm={3}>
            <Controller
              name={`questions.${index}.type`}
              control={control}
              render={({ field }) => (
                <CustomTextField select fullWidth label='Type' {...field}>
                  <MenuItem value='YesNo'>Yes / No</MenuItem>
                  <MenuItem value='TextInput'>Text Input</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Required Toggle */}
          <Grid item xs={12} sm={2}>
            <Controller
              name={`questions.${index}.isRequired`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} />}
                  label='Required'
                />
              )}
            />
          </Grid>

          {/* Delete Button */}
          <Grid item xs={12} sm={1}>
            <IconButton color='error' onClick={() => remove(index)}>
              <Icon icon='tabler:x' />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export default QuestionBuilder
