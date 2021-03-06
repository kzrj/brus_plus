import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { getToday } from '../../components/utils';
import { createUrlParamsFromFilters } from '../../redux/api/utils';

import { ExpensesList, CreateExpense } from '../../components/Expenses';


export class ExpensesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createExpense: null,
      expenses: [],
      total: null,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({created_at_after: getToday()});
    
    axios({
      method: 'get',
      url: endpoints.MANAGER_CASH_RECORDS_LIST,
      params: params,
      headers: { 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        expenses: initData.records,
        total: initData.total
        });
    })
  }

  createExpense = (expense) => {
    const token = localStorage.getItem('token');
    
    axios({
      method: 'post',
      url: endpoints.MANAGER_CASH_RECORDS_CREATE,
      data: expense,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: response.data.message, createdExpense: response.data.expense,
        expenses: response.data.records, total: response.data.total });
    })
  }

  deleteExpense = (id) => {
    const token = localStorage.getItem('token');

    axios({
      method: 'delete',
      url: endpoints.manager_delete_expense(id),
      headers: {'Authorization': `JWT ${token}` }
    })
    .then(res => {
      this.setState({ ...this.state, 
        expenses: res.data.records,
        total: res.data.totals,
        amount: 0 });
    })
  }

  render() {
    const { expenses, createdExpense, total } = this.state
    return (
      <div className='card card-style mt-2'>
        <div className='content mb-0'>
          <h3 className=''>??????????????</h3>
        </div>
        <div className='content mb-0'>
          {createdExpense
            ? <div>
                <button className='btn btn-m bg-highlight' onClick={() => this.setState({createdExpense: null})}>
                  ?????????????? ??????
                </button>
              </div>
            : <CreateExpense createExpense={this.createExpense}/>
          }
        </div>
        <div className='content'>
          <h3 className='mb-1'>???? ????????</h3>
          {total && <h5 className='mb-1'>??????????: {total}??</h5> }
          <ExpensesList expenses={expenses} user={this.props.user} deleteExpense={this.deleteExpense}/>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
  shopToSee: state.auth.shopToSee,
  state: state
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpensesContainer);