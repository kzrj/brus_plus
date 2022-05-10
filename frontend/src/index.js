import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Provider } from 'react-redux';
import configureStore from './redux/store/';
import { SnackbarProvider } from 'notistack';

// Containers
import Main from './containers/Main';
import Header from './containers/HeaderContainer';
import ManagerShiftList  from './containers/manager/Shifts';
import ManagerStock from './containers/manager/Stock';
import ShiftCreateComponent from './containers/manager/CreateShift';
import SaleCreateCommonContainer from './containers/manager/SaleCreateCommon';
import SaleList from './containers/manager/SaleList';
import DailyRepContainer from './containers/manager/DailyRep';
import ExpensesContainer from './containers/manager/Expenses';
import ResawContainer from './containers/manager/Resaw';

import requireAuthentication from './containers/AuthContainer';

const store = configureStore()
 
ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div className='app' id="page">
          <Header />
          <div className="page-content header-clear">
            <Switch>
              <Route exact path="/" component={Main} />

              <Route exact path="/manager/shift_list/" 
                component={requireAuthentication(ManagerShiftList, ['manager', 'boss', 'capo'])} />

              <Route exact path="/manager/stock/" 
                component={requireAuthentication(ManagerStock, ['manager', 'boss', 'capo', 'seller'])} />

              <Route exact path="/manager/sale_list/" 
                component={requireAuthentication(SaleList, ['manager', 'boss', 'capo', 'seller'])} />

              <Route exact path="/manager/shift/create_shift/" 
                component={requireAuthentication(ShiftCreateComponent, ['manager'])} />

              <Route exact path="/manager/sales/create_sale/" 
                component={requireAuthentication(SaleCreateCommonContainer, ['manager'])} />       

              <Route exact path="/manager/expenses/" 
                component={requireAuthentication(ExpensesContainer, ['manager', 'boss', 'capo',])} />

              <Route exact path="/manager/daily_report/" 
                component={requireAuthentication(DailyRepContainer, ['manager', 'boss', 'capo',])} />

              <Route exact path="/manager/resaws/create/" 
                component={requireAuthentication(ResawContainer, ['manager', 'boss', 'capo',])} />
            </Switch>
          </div>
        </div>
      </Router>
    </SnackbarProvider>
  </Provider>, document.getElementById('root')
);