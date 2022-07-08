import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/shiftListPageApi';

import { jsDateTimeToStrDate } from '../commons/utils';
import { DateFilter } from '../commons/CommonForms';
import { ShiftList } from './ShiftsComponent';


const shiftListApi = endpoints.create();

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
  }

  componentDidMount() {
    let today = new Date()
    let yesterday = new Date()
    yesterday.setDate(today. getDate() - 1);
    let startDate = jsDateTimeToStrDate(yesterday)
    let endDate = jsDateTimeToStrDate(today)

    shiftListApi.getShiftList({shop: this.props.shopToSee.id, 
      date_before: endDate, date_after:startDate})
    .then(data => {
      this.setState({ ...this.state, shiftList: data.results, startDate: startDate, endDate: endDate });
    })
  }

  setData = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  showResults = () => {
    shiftListApi.getShiftList({shop: this.props.shopToSee.id, 
      date_before: this.state.endDate, date_after: this.state.startDate})
    .then(data => {
      this.setState({ ...this.state, shiftList: data.results});
    })
  }

  deleteShift = (id) => {
    shiftListApi.deleteShift(id)
    .then(data => {
      this.setState({ shiftList: data.shifts });
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ManagerShiftList);