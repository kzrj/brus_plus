import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, lodashToggle } from '../../components/utils';
import { ShiftToSave, CreatedShift, LumberTableMixed } from '../../components/ShiftCreateComponent';


export class ShiftCreateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lumbers: [],
      initLumbers: [],
      totalVolume: 0,
      totaCash: 0,

      createdShift: null,

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
        headers: { 'Authorization': `JWT ${token}` }
      }
    ).then(res => {
        const initData = res.data;
        this.setState({ lumbers: initData.lumbers, initLumbers: initData.lumbers, 
          employees: initData.employees });
      })
  }

  calcRowQuantity = (lumber, qnty) => {
    let calcLumber = {
      ...lumber,
      lumber: lumber.id,
      quantity: qnty,
      volume_total: qnty * lumber.volume,
      cash: qnty * lumber.volume * lumber.employee_rate,
      employee_rate: lumber.employee_rate
    }
    return calcLumber
  }

  calcRowRate = (lumber, rate) => {
    let calcLumber = {
      ...lumber,
      lumber: lumber.id,
      quantity: lumber.quantity,
      volume_total: lumber.quantity * lumber.volume,
      cash: lumber.quantity * lumber.volume * rate,
      employee_rate: rate
    }
    return calcLumber
  }

  calcTotalVolume = (lumbers) => {
    let totalVolumeVar = 0

    lumbers.map(lumber => {
      totalVolumeVar = totalVolumeVar + lumber.volume_total
    })

    return totalVolumeVar
  }

  calcTotalCash = (lumbers) => {
    let totalCashVar = 0

    lumbers.map(lumber => {
      totalCashVar = totalCashVar + lumber.cash
    })

    return totalCashVar
  }

  calcRowAndTotal = (e, lumber) => {
    let { lumbers } = this.state
    let calcLumber
    if (e.target.name === 'quantity') {
      calcLumber = this.calcRowQuantity(lumber, e.target.value)
    }
    if (e.target.name === 'rate') {
      calcLumber = this.calcRowRate(lumber, e.target.value)
    }

    lumbers = replaceItemInDictArrayById(lumbers, calcLumber)

    let totalVolume = this.calcTotalVolume(lumbers)

    let totalCash = this.calcTotalCash(lumbers)
    
    this.setState({ 
        ...this.state,
        lumbers: lumbers,
        totalVolume: totalVolume,
        totalCash: totalCash,
        message: null
        })
  }

  preSave = () => {
    const { lumbers, totalCash, totalVolume  } = this.state
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
      employees: [],
      employee_cash: totalCash,
      volume: totalVolume,
      employeesData: [],
      cash_per_employee: 0
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

  back = () => {
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
    const { lumbers, totalVolume, totalCash, message, createdShift, dataToSave, calcType}  = this.state
    return (
      <div>
        {createdShift
          ? <CreatedShift shift={createdShift} message={message}/>
          : dataToSave
            ? <ShiftToSave shift={dataToSave} saveData={this.saveData} back={this.back}/>
            : <div>
                <div className='card card-style mb-1 mt-2'>
                  <div className='content'>
                  <h2>Смена </h2>
                    <div className='d-flex justify-content-between my-2'>
                      <button className={calcType === 'mixed' ? 'btn btn-s bg-highlight' : 'btn btn-s border'}
                        onClick={() => this.switchCalc('mixed')}
                        >доска перемешку</button>
                      <button className={calcType === 'sorted' ? 'btn btn-s bg-highlight' : 'btn btn-s border'} 
                        onClick={() => this.switchCalc('sorted')}>
                        доска по сортам</button>
                    </div>
                    {lumbers.length > 0 &&
                      <LumberTableMixed
                        calcType={this.state.calcType}
                        lumbers={lumbers}
                        calcRowAndTotal={this.calcRowAndTotal}

                        totalCash={totalCash}
                        totalVolume={totalVolume}
                      />
                    }
                  </div>
                </div>
                {totalCash > 0 &&
                  <button   
                      onClick={this.preSave}
                      className='mt-4 btn btn-center-xl btn-xxl text-uppercase font-900 bg-highlight rounded-sm shadow-l'>
                      Далее
                    </button>
                }
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
});


const mapDispatchToProps = dispatch => ({  
})

export default connect(mapStateToProps, mapDispatchToProps)(ShiftCreateComponent);