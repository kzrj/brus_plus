import { takeEvery, all, takeLatest } from "redux-saga/effects";

/* -------------- API -------------- */
import AuthApi from "../api/authApi";

/* ------------- Types ------------- */
import { AuthTypes } from "../redux-sauce/auth";

/* ------------- Sagas ------------- */
import { logIn, logOut, checkToken, partialUpdateUser } from "./authSagas";
// import * as feedbacksSaga from './feedbacksSagas';

const authApi = AuthApi.create();

export default function* root() {
  yield all([
    takeEvery(AuthTypes.LOGIN_REQUEST, logIn, authApi),
    takeEvery(AuthTypes.LOGOUT_REQUEST, logOut, authApi),
    takeEvery(AuthTypes.CHECK_TOKEN_REQUEST, checkToken, authApi),
  ]);
}
