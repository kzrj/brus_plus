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
import  ManagerRamshikPayments  from './containers/manager/RamshikPayments';
import  ManagerShiftList  from './containers/manager/Shifts';
import ManagerStock from './containers/manager/Stock';
import { IncomeTimberCreateContainer } from './containers/manager/CreateIncome';
import ManagerIncomeTimbersList from './containers/manager/IncomeTimbers';
import QuotaOverview from './containers/manager/Quotas';

import ShiftCreateComponent from './containers/manager/CreateShift';
import { RamshikShiftList } from './containers/ramshik/ShiftList';
import { RamshikOverView } from './containers/ramshik/OverView';

import { SaleCalcContainer } from './containers/manager/SaleCalc';
import  SaleCreateCommonContainer from './containers/manager/SaleCreateCommon';
import SaleList from './containers/manager/SaleList';
import DailyRepContainer from './containers/manager/DailyRep';
import { ExpensesContainer } from './containers/manager/Expenses';
import ResawContainer from './containers/manager/Resaw';

import requireAuthentication from './containers/AuthContainer';

const store = configureStore()
 
ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} 
      // classes={{
      //   variantNeedToLogin: classes.needToLogin,
      // }}
    >
      <Router>
        <div className='app' id="page" className=''>
          <Header />
          <div className="page-content header-clear">
            <Switch>
              <Route exact path="/" component={Main} />

              {/* manager and kladman views */}
              <Route exact path="/manager/ramshik_payments/" 
                component={requireAuthentication(ManagerRamshikPayments, ['manager', 'boss', 'capo'])} />
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
              <Route exact path="/manager/sales/calc/" 
                component={requireAuthentication(SaleCalcContainer, ['manager', 'boss', 'capo', 'seller'])} />
              <Route exact path="/manager/expenses/" 
                component={requireAuthentication(ExpensesContainer, ['manager', 'boss', 'capo',])} />
              <Route exact path="/manager/daily_report/" 
                component={requireAuthentication(DailyRepContainer, ['manager', 'boss', 'capo',])} />
              <Route exact path="/manager/resaws/create/" 
                component={requireAuthentication(ResawContainer, ['manager', 'boss', 'capo',])} />

              {/* manager only */}
              <Route exact path="/manager/rawstock/create_income/" 
                component={requireAuthentication(IncomeTimberCreateContainer, ['manager', 'boss', 'capo',])} />
              <Route exact path="/manager/rawstock/income_timbers/" 
              component={requireAuthentication(ManagerIncomeTimbersList, ['manager', 'boss', 'capo',])} />
              <Route exact path="/manager/quotas/overview/" 
                component={requireAuthentication(QuotaOverview, ['manager', 'boss', 'capo',])} />

              {/* ramshik views */}
              {/* <Route exact path="/ramshik/shift/create_shift/" 
                component={requireAuthentication(ShiftCreateComponent, ['is_senior_ramshik'])} /> */}
              <Route exact path="/ramshik/shift/list/" 
                component={requireAuthentication(RamshikShiftList, ['is_ramshik'])} />
              {/* <Route exact path="/ramshik/payouts/" 
              component={requireAuthentication(RamshikPayouts, ['is_ramshik'])} /> */}
              <Route exact path="/ramshik/main/" 
              component={requireAuthentication(RamshikOverView, ['is_ramshik'])} />

              {/* kladman views */}

            </Switch>
          </div>
        </div>
      </Router>
    </SnackbarProvider>
  </Provider>, document.getElementById('root')
);