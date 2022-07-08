import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/expensesPageApi';

import { getToday } from '../commons/utils';
import { ExpensesList, CreateExpense } from './ExpensesComponent';

const expensesApi = endpoints.create();


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
    expensesApi.getExpenses({created_at_after: getToday()})    
    .then(initData => {
      this.setState({ 
        expenses: initData.records,
        total: initData.total
        });
    })
  }

  createExpense = (expense) => {
    expensesApi.createExpense(expense)
    .then(data => {
      this.setState({ message: data.message, createdExpense: data.expense, expenses: data.records,
         total: data.total });
    })
  }

  deleteExpense = (id) => {
    expensesApi.deleteExpense(id)
    .then(data => {
      this.setState({ ...this.state, expenses: data.records, total: data.totals, amount: 0 });
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