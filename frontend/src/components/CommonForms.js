import React, { Component, useState  } from 'react';
import { Field, reduxForm } from 'redux-form';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';

// import { getToday } from '../utils';
// import { ErrorOrMessage } from '../CommonComponents';

export const renderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>
  }
}

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

export function renderSelectField ({
  input,
  label,
  formClass,
  labelClass,
  meta: { touched, error },
  children,
  options,
  menuItemClass,
  ...custom
}) {

  return (
  <FormControl error={touched && error} className={formClass} fullWidth={true}>
    <InputLabel className={labelClass}>{label}</InputLabel>
    <Select
      {...input}
      {...custom}
      fullWidth={true}
      // classes={{
      //   root: itemClassF(input.value),
      //   // label: classes.label, // class name, e.g. `classes-nesting-label-x`
      // }}
    >
      {options.map(option =>
          <MenuItem value={option.value} 
            // classes={{
            //   root: itemClassF(option.value),
            //   // label: classes.label, // class name, e.g. `classes-nesting-label-x`
            // }}
            >
            {option.label}
          </MenuItem>
          )}
    </Select>
    {renderFromHelper({ touched, error })}
  </FormControl>
  )
}

export const renderChildrenSelectField = ({
  input,
  label,
  formClass,
  labelClass,
  meta: { touched, error },
  children,
  options,
  ...custom
}) => (
  <FormControl error={touched && error} className={formClass} fullWidth={true}>
    <InputLabel className={labelClass}>{label}</InputLabel>
    <Select
      {...input}
      {...custom}
      fullWidth={true}
    >
      {children}
    </Select>
    {renderFromHelper({ touched, error })}
  </FormControl>
)

export const renderChildrenSelectFieldStandard = ({
  input,
  label,
  formClass,
  labelClass,
  meta: { touched, error },
  children,
  options,
  ...custom
}) => (
  
  <FormControl className={formClass}>
    <InputLabel htmlFor="grouped-native-select">Grouping</InputLabel>
    <Select native defaultValue="" id="grouped-native-select">
      <option aria-label="None" value="" />
      <optgroup label="Category 1">
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
      </optgroup>
      <optgroup label="Category 2">
        <option value={3}>Option 3</option>
        <option value={4}>Option 4</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
      </optgroup>
    </Select>
  </FormControl>
  // <FormControl error={touched && error} className={formClass} fullWidth={true}>
  //   <InputLabel className={labelClass}>{label}</InputLabel>
  //   <input
  //     type='select'
  //   >
  //     {children}
  //   </input>
  //   {renderFromHelper({ touched, error })}
  // </FormControl>
)

export const renderDateTimeField = ({
  label,
  placeholder,
  input,
  meta: { touched, invalid, error },
  labelClass,
  ...custom
}) => (

  <TextField
    fullWidth={true}
    label={label}
    type="date"
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
    InputLabelProps={{
      className: labelClass,
      shrink: true 
    }}
  />
)

export const renderSocials = ({ fields, meta: { error, submitFailed } }) => (
  <div className=''>
    <button className='btn btn-m mb-2 rounded-s text-uppercase font-900 shadow-s
          bg-blue2 text-wrap' type="button" onClick={() => fields.push({})}>
      Добавить пиломатериал
    </button>
    {submitFailed && error && <span>{error}</span>}

  {fields.map((lumber, index) => (
    <div key={index} >
      <Field
        name={`${lumber}.lumber`}
        type="text"
        // formClass='mx-1 align-middle w-25'
        component={renderChildrenSelectFieldStandard}
        
      >
        <option className='font-10' value='vk' >
          vk
        </option>
        <option className='font-10' value='inst'>instagram</option>
        <option className='font-10' value='web'>web</option>
      </Field>
      
      <Field
        name={`${lumber}.quantity`}
        type="number"
        component={renderTextField}
        label="количество"
        // style={{'width':'60%'}}
        // placeholder='https://somewebsite.com'
      />
      <Field
        name={`${lumber}.rate`}
        type="number"
        component={renderTextField}
        label="цена за 1м3"
      />

      <p>asdasd{`${lumber}.quantity`}</p>

      <span 
        className='btn btn-xxs ml-2 rounded-s font-900 shadow-s border-red2-dark bg-red2-light'
        type="button"
        title="Remove Member"
        onClick={() => fields.remove(index)}>
          X
      </span>
    </div>
  ))}
</div>
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
        // label={'Дата '}
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