import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, toggleArrayDictById, lodashToggle, getObjectbyId } from '../../components/utils';
import { ShiftToSave, CreatedShift } from '../../components/ShiftCreateComponent';
import { LumberToBuy } from '../../components/BuyComponent';


export class ShiftCreateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lumbers: [],
      lumbersToBuy: [],
      totalVolume: 0,
      totaCash: 0,

      createdShift: null,

      employees: [],
      activeEmployees: [],

      dataToSave: null,

      calcType: 'mixed',

      message: null,
      error: null,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    axios(
      {
        method: 'get',
        url: endpoints.MANAGER_SHIFT_CREATE_DATA,
        // params: params,
        headers: { 'Authorization': `JWT ${token}` }
      }
    ).then(res => {
        const initData = res.data;
        this.setState({ lumbers: initData.lumbers, initLumbers: initData.lumbers, 
          employees: initData.employees });
      })
  }

  addLumberToSale = () => {
    this.setState({
      ...this.state,
      lumbersToBuy: [
        ...this.state.lumbersToBuy,
        {id: this.state.lumbersToBuy.length}
      ]
    })
  }

  addLumber = (e, id) => {
    let { lumbersToBuy, lumbers } = this.state
    let lumberData = getObjectbyId(lumbers, e.target.value)
    lumberData = { ...lumberData, id: id, }
    
    lumbersToBuy = replaceItemInDictArrayById(lumbersToBuy, lumberData)
    
    this.setState({
      lumbersToBuy: lumbersToBuy
    })
  }

  delLumber = (id) => {
    let { lumbersToBuy } = this.state
    let lumber = getObjectbyId(lumbersToBuy, id)
    lumbersToBuy = toggleArrayDictById(lumbersToBuy, lumber)
    // const { totalCash, totalVolume } = this.calcTotal(lumbersToBuy)

    this.setState({
      lumbersToBuy: lumbersToBuy,
      // totalCash: totalCash,
      // totalVolume: totalVolume
    })
  }

  calcRowQnty = (e, id) => {
    let { lumbersToBuy } = this.state
    let lumber = getObjectbyId(lumbersToBuy, id)
    lumber.quantity =  e.target.value ? parseInt(e.target.value) : 0
    lumber.volume_total = (lumber.volume * lumber.quantity).toFixed(4)
    lumber.cash = (lumber.volume_total * lumber.employee_rate).toFixed(0)

    lumbersToBuy = replaceItemInDictArrayById(lumbersToBuy, lumber)
    // const { totalCash, totalVolume } = this.calcTotal(lumbersToBuy)
    
    this.setState({
      lumbersToBuy: lumbersToBuy,
      // totalCash: totalCash,
      // totalVolume: totalVolume
    })
  }

  preSave = () => {
    const { lumbers, totalCash, totalVolume, activeEmployees } = this.state
    let eIds = []
    activeEmployees.map(emp => eIds = lodashToggle(eIds, emp.id))
    let raw_records = []
    lumbers.map(lumber =>{
      if (lumber.cash > 0 && lumber.quantity > 0) {
        raw_records = lodashToggle(raw_records, lumber)
      }
    })
    let data = {
      shift_type: 'day',
      date: null,
      raw_records: raw_records,
      employees: eIds,
      employee_cash: totalCash,
      volume: totalVolume,
      employeesData: activeEmployees,
      cash_per_employee: totalCash / eIds.length
    }

    this.setState({
      ...this.state,
      dataToSave: data,
    })
  }

  saveData = () => {
    const { dataToSave} = this.state
    const token = localStorage.getItem('token');
    axios({
      method: 'post',
      url: endpoints.MANAGER_SHIFT_CREATE,
      data: dataToSave,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: 'Данные записаны.', createdShift: response.data });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })

    this.setState({
      ...this.state,
      activeEmployees: [],
      lumbers: this.state.initLumbers,
      totalVolume: 0,
      totalCash: 0,
      note: '',
      dataToSave: null,
    })
  }

  back = () =>{
    this.setState({dataToSave: null})
  }

  switchCalc = (calcType) => {
    this.setState({
      lumbers: this.state.initLumbers,
      totalCash: 0,
      totalVolume: 0,
      calcType: calcType,
      activeEmployees: []
    })
  }

  render() {
    const { message, createdShift, dataToSave, lumbersToBuy, lumbers }  = this.state
    console.log(lumbersToBuy)
    return (
      <div>
        {createdShift
          ? <CreatedShift shift={createdShift} message={message}/>
          : dataToSave
            ? <ShiftToSave shift={dataToSave} saveData={this.saveData} back={this.back}/>
            : <div>
                {lumbersToBuy.map(lumberToBuy => 
                  <LumberToBuy 
                    lumber={lumberToBuy} 
                    lumbers={lumbers}
                    addLumber={this.addLumber}
                    delLumber={this.delLumber}
                  />
                  )}
                
                <div className='d-flex justify-content-center'>
                  <button className='mt-1 btn btn-l bg-highlight' onClick={this.addLumberToSale}>
                    Добавить пиломатериал
                  </button>
                </div>
              </div>          
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(ShiftCreateComponent);