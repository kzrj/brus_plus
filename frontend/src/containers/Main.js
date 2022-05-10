 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
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

function ShopMenu (props) {
  const { user, shopToSee } = props
  let manager_access = false

  if (user.is_manager && user.shop_id === shopToSee.id) {
    manager_access = true
  }

  return (
    <div className=' '>
      <div className='my-4'>
        <h3 className='text-center'>Склад</h3>
        <MenuItem title={'Склад. Текущие остатки'} to={'/manager/stock/'}/>
      </div>

      {user.can_see_shop_shift.includes(shopToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Приход пиломатериалов</h3>
            <MenuItem title={'Приход список'} to={'/manager/shift_list/'}/>
          {manager_access &&
            <MenuItem title={'Создать приход'} to={'/manager/shift/create_shift/'}/>
          }
        </div>
      }

      {user.can_see_shop_resaws.includes(shopToSee.id) &&
        <div className='my-4'>
         <MenuItem title={'Перепил'} to={'/manager/resaws/create/'}/>
        </div>
      }
      
      {user.can_see_shop_sales.includes(shopToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Продажи</h3>
          {manager_access &&
            <MenuItem title={'Создать продажу'} to={'/manager/sales/create_sale/'}/>
          }
          <MenuItem title={'Продажи список'} to={'/manager/sale_list/'}/>
        </div>
      }

      {user.can_see_shop_cash.includes(shopToSee.id) &&
        <div className='my-4'>
          <h3 className='text-center'>Отчеты и расходы</h3>
          {manager_access && 
            <MenuItem title={'Расходы'} to={'/manager/expenses/'}/>
          }
          <MenuItem title={'Итоги за день'} to={'/manager/daily_report/'}/>
        </div>
      }
    </div>
  )

}

function AfterLogin (props) {
  const { user, setShopToSee, shopToSee } = props

  if (user.can_see_shop_stock) {
      return (
        shopToSee.id 
        ? <ShopMenu user={user} shopToSee={shopToSee}/>
        : <div className='my-3'>
          {user.can_see_shop_stock.map(shop => 
            <div className='card card-style' onClick={() => setShopToSee(shop)}>
              <div className='content'>
                <h4 className='text-center'>{shop.name}</h4>
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
  }

  login = () => {
    this.props.login(this.props.form.values)
  }

  render() {
    const { isLoggedIn, fetching, user, shopToSee } = this.props.state.auth

    return (
      fetching 
        ? <CircularProgress />
        : isLoggedIn 
            ? <AfterLogin user={user} logout={this.props.logout} setShopToSee={this.props.setShopToSee}
                shopToSee={shopToSee}/>
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
  setShopToSee: (shop) => dispatch(AuthActions.setShopToSee(shop))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
