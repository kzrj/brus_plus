import axios from 'axios';

import React, { Component } from 'react';

import endpoints from '../../redux/api/endpoints';
import { getToday } from '../../components/utils';
import { createUrlParamsFromFilters } from '../../redux/api/utils';

import { CashRecordsList, SalesList } from '../../components/kladman/DailyRep';


export class DailyRepContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdExpense: null,
      expenses: [],

      incomes: [],

      sales: [],
      sellers_fee: [],

      allRecords: [],
      total: null,
      total_expenses: null,
      total_incomes: null,
    }
    this.createExpense = this.createExpense.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({created_at_after: getToday()});
    
    axios({
      method: 'get',
      url: endpoints.KLADMAN_DAYLY_REPORT_DATA,
      params: params,
      headers: { 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        expenses: initData.expense_records,
        total_expenses: initData.expense_records_total,
        incomes: initData.income_records,
        total_incomes: initData.income_records_total,
        allRecords: initData.records,
        total: initData.records_total,
        sales: initData.sales,
        sales_totals: initData.sales_totals,
        sellers_fee: initData.sales_sellers_fee
        });
    })
  }

  createExpense (expense) {
    const token = localStorage.getItem('token');
    
    axios({
      method: 'post',
      url: endpoints.KLADMAN_EXPENSE_CREATE,
      data: expense,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: response.data.message, createdExpense: response.data.expense,
        allRecords: response.data.records, total: response.data.total });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })
  }

  render() {
    const { expenses, total_expenses, sales, sales_totals } = this.state
    return (
      <div className='card card-style mt-2 mb-0'>
        <div className='content mb-0'>
          <h3 className=''>Дневной отчет</h3>
        </div>
        <div className='content mb-0 mt-0'>
          <h5 className=''>Продажи</h5>
          <SalesList sales={sales} sales_totals={sales_totals} sellers_fee={this.state.sellers_fee}/>
        </div>
        <div className='content mt-0'>
          <h5 className='mb-1'>Расходы за день</h5>
          {total_expenses && 
            <p className='mb-1 font-15 color-black'>
              Итого расход: 
              <span className='font-500 color-red1-light'> -{total_expenses}р</span>
            </p> }
          <CashRecordsList records={expenses}/>
        </div>
      </div>
    )
  }
}