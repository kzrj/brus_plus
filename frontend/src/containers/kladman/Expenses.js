import axios from 'axios';

import React, { Component } from 'react';

import endpoints from '../../redux/api/endpoints';
import { getToday } from '../../components/utils';
import { createUrlParamsFromFilters } from '../../redux/api/utils';

import { ExpensesList, CreateExpense } from '../../components/kladman/Expenses';


export class ExpensesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createExpense: null,
      expenses: [],
      total: null,
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
        total: initData.expense_records_total
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
        expenses: response.data.records, total: response.data.total });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })
  }

  render() {
    const { expenses, createdExpense, total } = this.state
    return (
      <div className='card card-style mt-2'>
        <div className='content mb-0'>
          <h3 className=''>Расходы</h3>
        </div>
        <div className='content mb-0'>
          {createdExpense
            ? <div>
                <button className='btn btn-m bg-highlight' onClick={() => this.setState({createdExpense: null})}>
                  Создать еще
                </button>
              </div>
            : <CreateExpense createExpense={this.createExpense}/>
          }
        </div>
        <div className='content'>
          <h3 className='mb-1'>За день</h3>
          {total && <h5 className='mb-1'>Итого: {total}р</h5> }
          <ExpensesList expenses={expenses}/>
        </div>
      </div>
    )
  }
}