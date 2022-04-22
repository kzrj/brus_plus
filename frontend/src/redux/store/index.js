import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import { reducer as formReducer } from 'redux-form';

export const reducers = combineReducers({
  auth: require('../redux-sauce/auth').reducer,
  
  form: formReducer,
})

export default (history) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  ));

  let sagasManager = sagaMiddleware.run(rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas)
      })
    })
  }

  return store
}

