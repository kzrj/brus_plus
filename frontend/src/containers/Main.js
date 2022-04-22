 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";
import { CircularProgress } from '@material-ui/core'

import AuthActions from '../redux/redux-sauce/auth';

import { LoginForm } from '../components/CommonForms';


export function MenuItem (props) {
  let history = useHistory()

  function handleClick() {
    history.push(props.to);
  }
  return (
    <div 
      className='card-style mx-5 my-3 pt-2'
      onClick={handleClick}
      style={{
        'background': 'white',
        'width': '300px',
        // 'height': '0px',
        'color': 'white',
        'font-weight': 'bold',
        'font-size': '1em',
        'text-align': 'center',
        'word-break': 'break-word',
        'border-radius': '15px',
        'line-height': '12px',
      }}
    >
      <h5>{props.title}</h5>
    </div>
  )
}

function RamaMenu (props) {
  const { user, ramaToSee } = props
  let manager_access = false
  if (user.is_manager && user.rama_id === ramaToSee.id) {
    manager_access = true
  }

  return (
    <div className=' '>
      <div className='my-4'>
        <h3 className='text-center'>Склад</h3>
        <MenuItem title={'Склад. Текущие остатки'} to={'/manager/stock/'}/>
      </div>

      {user.can_see_rama_raw_stock.includes(ramaToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Круглый лес и план</h3>
          {manager_access && 
            <MenuItem title={'Приход круглого леса'} to={'/manager/rawstock/create_income/'}/>}
          <MenuItem title={'Список отгрузок круглого леса'} to={'/manager/rawstock/income_timbers/'}/>
          <MenuItem title={'План'} to={'/manager/quotas/overview/'}/>
        </div>
      }

      {user.can_see_rama_shift.includes(ramaToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Смены</h3>
            <MenuItem title={'Смены список'} to={'/manager/shift_list/'}/>
          {manager_access &&
            <MenuItem title={'Создать смену'} to={'/manager/shift/create_shift/'}/>
          }
        </div>
      }

      {user.can_see_rama_resaws.includes(ramaToSee.id) &&
        <div className='my-4'>
         <MenuItem title={'Перепил'} to={'/manager/resaws/create/'}/>
        </div>
      }
      
      {user.can_see_rama_sales.includes(ramaToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Продажи</h3>
          {manager_access &&
            <MenuItem title={'Создать продажу'} to={'/manager/sales/create_sale/'}/>
          }
          <MenuItem title={'Калькулятор продавца'} to={'/manager/sales/calc/'}/>
          <MenuItem title={'Продажи список'} to={'/manager/sale_list/'}/>
        </div>
      }

      {user.can_see_rama_cash.includes(ramaToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Отчеты и расходы</h3>
          {manager_access && [
            <MenuItem title={'Расходы'} to={'/manager/expenses/'}/>,
            <MenuItem title={'Расчет рамщиков'} to={'/manager/ramshik_payments/'}/>]
          }
          <MenuItem title={'Итоги за день'} to={'/manager/daily_report/'}/>
        </div>
      }
    </div>
  )

}

function AfterLogin (props) {
  const { user, setRamaToSee, ramaToSee } = props

  if (user.is_ramshik) 
    return <Redirect to="/ramshik/main" />
  
  if (user.can_see_rama_stock) {
      return (
        ramaToSee.id 
        ? <RamaMenu user={user} ramaToSee={ramaToSee}/>
        : <div className='my-3'>
          {user.can_see_rama_stock.map(rama => 
            <div className='card card-style' onClick={() => setRamaToSee(rama)}>
              <div className='content'>
                <h4 className='text-center'>{rama.name}</h4>
              </div>
            </div>
            )}
        </div>
      )
    }
}


class Main extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      username: '',
      password: '',
    }
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    
  }

  login () {
    this.props.login(this.props.form.values)
  }

  render() {
    const { isLoggedIn, fetching, user, ramaToSee } = this.props.state.auth
    return (
      fetching 
        ? <CircularProgress />
        : isLoggedIn 
            ? <AfterLogin user={user} logout={this.props.logout} setRamaToSee={this.props.setRamaToSee}
                ramaToSee={ramaToSee}/>
            : <LoginForm parentSubmit={this.login} />
    )
  }
}

const mapStateToProps = (state) => ({
  routing: state.routing,
  state: state,
  form: state.form.loginForm
})

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(AuthActions.loginRequest(payload)),
  logout: (payload) => dispatch(AuthActions.logoutRequest(payload)),
  checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
  setRamaToSee: (rama) => dispatch(AuthActions.setRamaToSee(rama))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
