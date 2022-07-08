import React, { } from 'react';
import { Field, reduxForm } from 'redux-form';

import TextField from '@material-ui/core/TextField';

export const renderTextField = ({
  label,
  placeholder,
  input,
  multiline,
  meta: { touched, invalid, error },
  labelClass,
  ...custom
}) => (
  <TextField
    fullWidth={true}
    label={label}
    placeholder={placeholder}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
    multiline={multiline}
    InputLabelProps={{
      className: labelClass,
    }}
  />
)

export function LoginForm (props) {
  const { parentSubmit, pristine, reset, submitting, handleSubmit, eventFetching, eventError, message }
     = props
  return (
    <div className='card card-style'>
      <div className='content'>
        <form onSubmit={handleSubmit(parentSubmit)} className='' > 
          <Field 
            component={renderTextField}
            label="Логин" 
            name='username'
            margin='dense'
          />

          <Field 
            component={renderTextField}
            label="Пароль" 
            name='password'
            margin='dense'
            type='password'
          />

          <button 
            className='btn btn-m mt-2 font-900 shadow-s bg-highlight text-wrap'
            type="submit"
            disabled={pristine || submitting}>
            Войти
          </button>

          {/* <ErrorOrMessage error={eventError} message={message} fetching={eventFetching}
              className='mt-2 mb-0 mx-1 font-15' /> */}
        </form>
      </div>
    </div>
  )
}

const validateLoginForm = values => {
  const errors = {}
  const requiredFields = [
    'username',
    'password'
  ]
  
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Обязательное поле'
    }
  })
  return errors
}

LoginForm = reduxForm({
  form: 'loginForm',
  validate: validateLoginForm,
})(LoginForm)


export function DateFilter(props) {
  const { startDate, endDate, setData, showResults } = props
  return (
    <div className='d-flex justify-content-between'>
      <TextField
        label={'Дата с'}
        type="date"
        name='startDate'
        className='mr-2'
        value={startDate}
        onChange={setData}
        InputLabelProps={{
          className: '',
          shrink: true 
        }}
      />
      <TextField
        label={'Дата до'}
        type="date"
        name='endDate'
        className='mr-2'
        value={endDate}
        onChange={setData}
        InputLabelProps={{
          className: '',
          shrink: true 
        }}
      />
      <button className='btn btn-xs bg-highlight' onClick={showResults}>
        показать
      </button>
    </div>
  )
} 

export function DayFilter(props) {
  const { date, setData, showResults } = props
  return (
    <div className='d-flex justify-content-between'>
      <TextField
        type="date"
        name='date'
        className='mr-2'
        value={date}
        onChange={setData}
        InputLabelProps={{
          className: '',
          shrink: true 
        }}
      />
      <button className='btn btn-xs bg-highlight' onClick={showResults}>
        показать
      </button>
    </div>
  )
} 