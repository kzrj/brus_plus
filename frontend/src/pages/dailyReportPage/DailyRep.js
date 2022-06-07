import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/dailyReportPageApi';
import { getToday } from '../../components/utils';

import { CashRecordsList, SalesList } from './DailyRepComponent';
import { DayFilter } from '../../components/CommonForms';

const dailyReportApi = endpoints.create();

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

      date: ''
    }
  }

  componentDidMount() {
    dailyReportApi.getReport({date: getToday(), shop: this.props.shopToSee.id})
    .then(initData => {
      this.setState({ 
        expenses: initData.expense_records,
        total_expenses: initData.expense_records_total,
        incomes: initData.income_records,
        total_incomes: initData.income_records_total,
        allRecords: initData.records,
        total: initData.records_total,
        sales: initData.sales,
        sales_totals: initData.sales_totals,
        sellers_fee: initData.sales_sellers_fee,
        date: getToday()
        });
    })
  }

  setData = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  showResults = () => {
    dailyReportApi.getReport({shop: this.props.shopToSee.id, date: this.state.date})
    .then(initData => {
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

  render() {
    const { expenses, total_expenses, sales, sales_totals } = this.state
    return (
      <div className='card card-style mt-2 mb-0'>
        <div className='content mb-0 '>
          <h3 className=''>Дневной отчет</h3>
        </div>
        <div className='content mt-0'>
          <DayFilter date={this.state.date} setData={this.setData} showResults={this.showResults} />
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


const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
  shopToSee: state.auth.shopToSee,
  state: state
});


const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(DailyRepContainer);