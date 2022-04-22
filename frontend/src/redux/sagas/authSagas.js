import { put, call } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
// import Notifications from 'react-notification-system-redux';

import AuthActions from '../redux-sauce/auth'

export function * logIn (api, action) {
  const { data } = action;
  yield put(AuthActions.resetAuthErrors())
  try {
    let response = yield call(api.logIn, data)
    yield put(AuthActions.loginSuccess(response))
    yield put(AuthActions.toggleModal(false))
  } catch (e) {
    yield put(AuthActions.loginFailure(e.message))
    // yield put(Notifications.error({ title: 'Ошибка', message: e.message, position: 'tc' }));
  }
}

export function * signUp (api, action) {
  const { data } = action
  try {
    let response = yield call(api.signUp, data);
    yield put(AuthActions.signupSuccess(response));
    // yield put(push('/'));
  } catch (e) {
    yield put(AuthActions.signupFailure(e.message))
    // yield put(Notifications.error({ title: 'Ошибка', message: e.message, position: 'tc' }));
  }
}

export function * logOut (api, action) {
  try {
    yield call(api.logOut)
    yield put(AuthActions.logoutSuccess())
  } catch (e) {
    yield put(AuthActions.logoutFailure(e.message))
    // yield put(Notifications.error({ title: 'Ошибка', message: e.message, position: 'tc' }));
  }
}

export function* checkToken(api, action) {
  const { payload } = action;
  try {
    let response = yield call(api.checkToken, payload);
    yield put(AuthActions.checkTokenSuccess(response));
  } catch (e) {
    yield put(AuthActions.checkTokenFail(e.message))
  }
}

export function* checkAuth(api, action) {
  const { payload } = action;
  try {
    const response = yield call(api.checkAuth, payload);
    yield put(AuthActions.checkAuthSuccess(response));
  } catch (e) {
    // yield put(push('/'));
    // yield put(Notifications.error({ title: 'Ошибка', message: e.message, position: 'tc' }));
    yield put(AuthActions.checkAuthFail(e.message))
  }
}