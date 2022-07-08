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
import Main from './pages/mainMenuPage/Main';
import Header from './pages/mainMenuPage/HeaderContainer';

import ManagerStock from './pages/stockPage/Stock';
import ManagerShiftList  from './pages/shiftListPage/Shifts';
import ShiftCreateComponent from './pages/shiftCreatePage/CreateShift';

import SaleCreateCommonContainer from './pages/saleCreatePage/SaleCreateCommon';
import SaleList from './pages/saleListPage/SaleList';

import ExpensesContainer from './pages/expensesPage/Expenses';
import ManagerRamshikPayments  from './pages/suppliersPage/RamshikPayments';
import DailyRepContainer from './pages/dailyReportPage/DailyRep';

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
                component={ManagerShiftList} />

              <Route exact path="/manager/stock/" 
                component={ManagerStock} />

              <Route exact path="/manager/sale_list/" 
                component={SaleList} />

              <Route exact path="/manager/shift/create_shift/" 
                component={ShiftCreateComponent} />

              <Route exact path="/manager/sales/create_sale/" 
                component={SaleCreateCommonContainer} />       

              <Route exact path="/manager/expenses/" 
                component={ExpensesContainer} />

              <Route exact path="/manager/daily_report/" 
                component={DailyRepContainer} />

              <Route exact path="/manager/ramshik_payments/" 
                component={ManagerRamshikPayments} />

            </Switch>
          </div>
        </div>
      </Router>
    </SnackbarProvider>
  </Provider>, document.getElementById('root')
);