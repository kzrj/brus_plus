import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useHistory  } from "react-router-dom";

// actions
import AuthActions from '../redux/redux-sauce/auth';


function HeaderComp (props) {
  const histoty = useHistory()

  function handleClickLogout () {
    props.logout()
    histoty.push('/')
  }

  function handleClickMenu () {
    histoty.push('/')
  }

  function toMain () {
    props.setShopToSee({})
    histoty.push('/')
  }

  return (
    <div className='d-flex justify-content-between align-items-baseline px-3 py-2'>
      <h4 onClick={handleClickMenu}>{props.shopToSee.name}</h4>
      {props.shopToSee.name 
          ? <h6 onClick={toMain}>к списку торговых точек</h6>
          : <h4>Брус плюс</h4>
        }
      <button className='btn btn-xs bg-red1-light' style={{lineHeight: '13px'}} onClick={handleClickLogout}>
        <span className='py-0 my-0'>
          <span className='d-block'>{props.user.nickname}</span>
          выйти
        </span>
      </button>
    </div>
  )
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.checkToken(token);
    }
  }

  render() {
    const { isLoggedIn, fetching, user, shopToSee } = this.props.auth

    return (
      user
      ? <div className='header' >
          <HeaderComp logout={this.props.logout} user={user} shopToSee={shopToSee} 
            setShopToSee={this.props.setShopToSee}/>
        </div>
      : 'net login'
    )
  }
}

const mapStateToProps = (state) => ({
  state: state,
  auth: state.auth,
  routing: state.routing,
})

const mapDispatchToProps = (dispatch) => ({
  checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
  logout: () => dispatch(AuthActions.logoutRequest()),
  setShopToSee: (shop) => dispatch(AuthActions.setShopToSee(shop))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);