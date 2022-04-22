import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUrlParamsFromFilters } from '../../redux/api/utils';
import { jsDateTimeToStrDate } from '../../components/utils';
import endpoints from '../../redux/api/endpoints';
import { DateFilter } from '../../components/CommonForms';


function IncomeList (props) {
  const { list, deleteIncome, user } = props
  return (
    list.length > 0 &&
    <div>
      <div className='card card-style'>
        <div className='content'>
          всего
        </div>
      </div>
      {list.map(income => 
        <div className='card card-style'>
          <div className='content'>
            <p className='mb-1 color-black font-15'>Дата: {income.created_at}</p>
              <div className='d-flex justify-content-between'>
                <p className='mb-1 color-black font-15'>{income.who}</p>
                {user.is_boss && 
                  <button className='btn btn-s bg-red1-light' onClick={() => deleteIncome(income.id)} >
                    Удалить
                  </button>
                }
              </div>
            <p className='mb-2 color-black font-15 d-flex justify-content-between'>
              <span>Количество: {income.quantity} шт</span>
              <span>Объем: {income.volume} m3</span>
            </p>
            <table className='table table-sm'>
              <thead>
                <th>Диаметр/порода</th>
                <th>Количество</th>
                <th>Объем</th>
              </thead>
              <tbody>
                {income.timber_records.map(tr => 
                  <tr>
                    <td>{tr.timber}</td>
                    <td>{tr.quantity} шт</td>
                    <td>{tr.volume} м3</td>
                  </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
        )}
    </div>
  )
}

export class ManagerIncomeTimbersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeTimberList: [],

      startDate: '',
      endDate: '',
      
      message: null,
      error: null,
    }
    this.setData = this.setData.bind(this);
    this.showResults = this.showResults.bind(this);
    this.deleteIncome = this.deleteIncome.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(today. getDate() - 1);
    let startDate = jsDateTimeToStrDate(yesterday)
    let endDate = jsDateTimeToStrDate(today)
    const params = createUrlParamsFromFilters({rama: this.props.ramaToSee.id, 
      created_at_before: endDate, created_at_after:startDate});
    axios({
      method: 'get',
      url: endpoints.INCOME_TIMBERS,
      headers: {'Authorization': `JWT ${token}` },
      params: params
    })
    .then(response => {
      this.setState({ ...this.state, incomeTimberList: response.data.results, startDate: startDate, endDate: endDate });
    })
  }

  setData (e) {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  showResults () {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({rama: this.props.ramaToSee.id, 
      created_at_before: this.state.endDate, created_at_after: this.state.startDate});
    axios({
      method: 'get',
      url: endpoints.INCOME_TIMBERS,
      headers: {'Authorization': `JWT ${token}` },
      params: params
    })
    .then(response => {
      this.setState({ ...this.state, incomeTimberList: response.data.results, });
    })
  }

  deleteIncome (id) {
    const token = localStorage.getItem('token');
    axios({
      method: 'delete',
      url: endpoints.manager_rawstock_income_delete(id),
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ incomeTimberList: response.data.income_timbers });
    })
  }

  render() {
    const { incomeTimberList } = this.state
    return (
      <div>
        <div className='card card-style mt-2'>
          <div className='content'>
            <DateFilter startDate={this.state.startDate} endDate={this.state.endDate} setData={this.setData}
              showResults={this.showResults}/>
          </div>
        </div>
        <IncomeList list={incomeTimberList} user={this.props.user} deleteIncome={this.deleteIncome}/>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
  ramaToSee: state.auth.ramaToSee,
  state: state
});


const mapDispatchToProps = dispatch => ({
  // checkAuth: (groups) => dispatch(authActions.checkAuthRequest(groups))
  // auth
  // checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManagerIncomeTimbersList);