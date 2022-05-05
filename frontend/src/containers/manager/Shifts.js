import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUrlParamsFromFilters } from '../../redux/api/utils';
import { jsDateTimeToStrDate } from '../../components/utils';
import endpoints from '../../redux/api/endpoints';
import { ShiftList } from '../../components/Shifts';
import { DateFilter } from '../../components/CommonForms';


export class ManagerShiftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftList: [],

      startDate: '',
      endDate: '',
      
      message: null,
      error: null,
    }
    this.setData = this.setData.bind(this);
    this.showResults = this.showResults.bind(this);
    this.deleteShift = this.deleteShift.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(today. getDate() - 1);
    let startDate = jsDateTimeToStrDate(yesterday)
    let endDate = jsDateTimeToStrDate(today)
    const params = createUrlParamsFromFilters({shop: this.props.shopToSee.id, 
      date_before: endDate, date_after:startDate});
    axios({
      method: 'get',
      url: endpoints.SHIFTS,
      headers: {'Authorization': `JWT ${token}` },
      params: params
    })
    .then(response => {
      this.setState({ ...this.state, shiftList: response.data.results, startDate: startDate, endDate: endDate });
    })
  }

  setData (e) {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  showResults () {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({shop: this.props.shopToSee.id, 
      date_before: this.state.endDate, date_after: this.state.startDate});
    axios({
      method: 'get',
      url: endpoints.SHIFTS,
      headers: {'Authorization': `JWT ${token}` },
      params: params
    })
    .then(response => {
      this.setState({ ...this.state, shiftList: response.data.results, });
    })
  }

  deleteShift (id) {
    const token = localStorage.getItem('token');
    axios({
      method: 'delete',
      url: endpoints.manager_shift_delete(id),
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ shiftList: response.data.shifts });
    })
  }

  render() {
    return (
      <div>
        <div className='card card-style mt-2'>
          <div className='content'>
            <DateFilter startDate={this.state.startDate} endDate={this.state.endDate} setData={this.setData}
              showResults={this.showResults}/>
          </div>
        </div>
        <ShiftList shiftList={this.state.shiftList} user={this.props.user} deleteShift={this.deleteShift}/>
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
  // checkAuth: (groups) => dispatch(authActions.checkAuthRequest(groups))
  // auth
  // checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManagerShiftList);