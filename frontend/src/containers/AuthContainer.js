import React from 'react';
import { connect } from 'react-redux';
import AuthActions from '../redux/redux-sauce/auth'
import { Redirect } from "react-router-dom";

export default function requireAuthentication(Component, groups) {

    class AuthenticatedComponent extends React.Component {
        componentDidMount() {
          const token = localStorage.getItem('token');
          if (token) {
            this.props.checkToken(token);
          }
        }

        render() {
          let { fetching, user } = this.props.state.auth
          let access = false
          
          if (this.props.isLoggedIn) {
            if (groups.includes('manager') && user.is_manager)
              access = true

            if (groups.includes('boss') && user.is_boss)
              access = true

            if (groups.includes('capo') && user.is_capo)
              access = true

            if (groups.includes('seller') && user.is_seller)
              access = true
            
            if (groups.includes('is_ramshik') && user.is_ramshik)
              access = true
          }

          return (
            fetching 
              ? <p>Loading</p>
              : this.props.isLoggedIn
                ? access
                  ? <Component {...this.props} />
                  : <h4 className='text-center my-5'>Нет прав</h4>
                : <Redirect to={'/'}/>
          )
        }
    }

    const mapStateToProps = (state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        state: state
    });


    const mapDispatchToProps = dispatch => ({
        // checkAuth: (groups) => dispatch(authActions.checkAuthRequest(groups))
        // auth
        checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
    })

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}

