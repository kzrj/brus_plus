import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['data'],
  loginSuccess: ['user'],
  loginFailure: ['error'],

  signupRequest: ['data'],
  signupSuccess: ['user'],
  signupFailure: ['error'],

  logoutRequest: null,
  logoutSuccess: null,
  logoutFailure: ['error'],

  checkTokenRequest: ['payload'],
  checkTokenSuccess: ['payload'],
  checkTokenFail: ['error'],

  resetAuthErrors: null,

  restorePasswordRequest: ['data'],
  restorePasswordSuccess: null,
  restorePasswordFailure: ['error'],

  toggleModal: ['isAuthModalOpen'],
  
  checkAuthRequest: ['payload'],
  checkAuthSuccess: ['payload'],
  checkAuthFail: null,

  setRamaToSee: ['rama'],
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  user: null,
  error: '',
  isLoggedIn: false,
  isLoggingIn: false,
  ramaToSee: {},
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
  getUser: state => state.user
}

/* ------------- Reducers ------------- */

// rama to see
export const setRamaToSee = (state, { rama }) => {
  return state.merge({ ramaToSee: rama })
}

// login request
export const loginRequest = (state, { data }) => {
  return state.merge({ fetching: true, user: null, isLoggingIn: true, isLoggedIn: false, ramaToSee: {} })
}
  

// login success
export const loginSuccess = (state, { user }) => {
  return state.merge({ fetching: false, error: null, user: user, isLoggedIn: true, isLoggingIn: false })
}

// login fail
export const loginFailure = (state, action) => {
  const { error } = action
  return state.merge({ fetching: false, error: error, user: null, isLoggedIn: false, isLoggingIn: false })
}

// register request
export const signUpRequest = (state, { data }) =>
  state.merge({ fetching: true, user: {}, isLoggingIn: true, isLoggedIn: false })

// register success
export const signUpSuccess = (state, { user }) => {
  return state.merge({ fetching: false, error: null, user: user, isLoggingIn: false, isLoggedIn: true  })
}

// register fail
export const signUpFailure = (state, { error }) => {
  return state.merge({ fetching: false, error: error, user: null, isLoggingIn: false, isLoggedIn: false  })
}

// logout request
export const logoutRequest = (state) => {
  return state.merge({ fetching: true, isLoggingIn: true })
}
  

// logout success
export const logoutSuccess = (state) => {
  return state.merge({ fetching: false, error: null, user: null, isLoggingIn: false, isLoggedIn: false  })
}

// logout fail
export const logoutFailure = (state, { error }) => {
  return state.merge({ fetching: false, error: error, isLoggingIn: false })
}

export const resetAuthErrors = (state) => {
  return state.merge({ fetching: false, error: null })
}

// auth modal toggle 

export const toggleModal = (state, { isAuthModalOpen }) => {
  return state.merge({ isAuthModalOpen, error: null })
}
  
export const checkTokenRequest = (state, { payload }) => {
  return state.merge({ fetching: true })
}

export const checkTokenSuccess = (state, { payload }) => {
  return state.merge({ fetching: false, error: null, user: payload.user, isLoggedIn: true, isLoggingIn: false })
}

export const checkTokenFail = (state, { error }) => {
  return state.merge({ fetching: false, error: error, user: null, isLoggedIn: false, isLoggingIn: false })
}

export const checkAuthSuccess = (state, { payload }) => {
  return state.merge({ user: payload, isLoggedIn: true, isLogginIn: false })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_RAMA_TO_SEE]: setRamaToSee,

  [Types.LOGIN_REQUEST]: loginRequest,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: loginFailure,
  [Types.SIGNUP_REQUEST]: signUpRequest,
  [Types.SIGNUP_SUCCESS]: signUpSuccess,
  [Types.SIGNUP_FAILURE]: signUpFailure,
  [Types.CHECK_TOKEN_REQUEST]: checkTokenRequest,
  [Types.CHECK_TOKEN_FAIL]: checkTokenFail,
  [Types.CHECK_TOKEN_SUCCESS]: checkTokenSuccess,
  [Types.LOGOUT_REQUEST]: logoutRequest,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.LOGOUT_FAILURE]: logoutFailure,
  [Types.TOGGLE_MODAL]: toggleModal,
  [Types.RESET_AUTH_ERRORS]: resetAuthErrors,
  [Types.CHECK_AUTH_SUCCESS]: checkAuthSuccess
})
