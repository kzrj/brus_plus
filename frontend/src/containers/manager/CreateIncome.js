import axios from 'axios';

import React, { Component } from 'react';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, toggleArrayDictById, lodashToggle } from '../../components/utils';

import { TimberTable, CreatedIncome, IncomeToSave } from '../../components/CreateIncomeTimberComponent';


export class IncomeTimberCreateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timbers: [],
      initTimbers: [],
      calcType: 'pine',
      totalQnty: 0,
      totalVolume: 0.0,
      dataToSave: null,
      createdIncome: null
    }

    this.calcRowAndTotal = this.calcRowAndTotal.bind(this);
    this.preSave = this.preSave.bind(this);
    this.switchCalc = this.switchCalc.bind(this);
    this.saveData = this.saveData.bind(this)
    this.back = this.back.bind(this)
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    axios(
      {
        method: 'get',
        url: endpoints.MANAGER_RAWSTOCK_INCOME_INIT_DATA,
        // params: params,
        headers: { 'Authorization': `JWT ${token}` }
      }
    ).then(res => {
        const initData = res.data;
        this.setState({ timbers: initData.timbers, initTimbers: initData.timbers });
      })
  }

  calcRowAndTotal (e, timber) {
    let { timbers } = this.state
    timber.quantity = parseInt(e.target.value)

    if (timber.quantity > 0) {
      timber.total_volume = parseFloat(timber.quantity * timber.volume)
    }

    timbers = replaceItemInDictArrayById(timbers, timber)
    let totalQnty = 0
    let totalVolume = 0

    timbers.map(tmb => {
      totalQnty = totalQnty + parseInt(tmb.quantity ? tmb.quantity : 0)
      if (tmb.quantity > 0) {
        totalVolume = totalVolume + parseFloat(tmb.total_volume ? tmb.total_volume : 0.0)
      }
    })

    this.setState({ 
      ...this.state,
      timbers: timbers,
      totalQnty: totalQnty,
      totalVolume: totalVolume,
      message: null
    })
  }

  preSave () {
    const { timbers, totalQnty, totalVolume } = this.state
    let data = {
      raw_timber_records: timbers,
      totalQnty: totalQnty,
      totalVolume: totalVolume,
    }

    this.setState({
      ...this.state,
      dataToSave: data,
    })
  }

  saveData () {
    const { dataToSave } = this.state
    const token = localStorage.getItem('token');
    axios({
      method: 'post',
      url: endpoints.MANAGER_RAWSTOCK_INCOME_CREATE,
      data: dataToSave,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: 'Данные записаны.', createdIncome: response.data.income_timber });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })

    this.setState({
      ...this.state,
      timbers: this.state.initTimbers,
      totalQnty: 0,
      note: '',
      dataToSave: null,
    })
  }

  back () {
    this.setState({dataToSave: null})
  }

  switchCalc (calcType) {
    this.setState({
      timbers: this.state.timbers,
      totalQnty: 0,
      calcType: calcType,
    })
  }

  render() {
    const { timbers, totalQnty, totalVolume, calcType, createdIncome, dataToSave, message }  = this.state
    return (
      <div>
        {createdIncome 
          ? <CreatedIncome createdIncome={createdIncome} message={message}/>
          : dataToSave
            ? <IncomeToSave incomeTimber={dataToSave} saveData={this.saveData} back={this.back}/>
            : timbers.length > 0 &&
              <div className='card card-style mb-1 mt-2'>
                <div className='content mb-1'>
                  <h3>Приход круглого</h3>
                  <div className='d-flex justify-content-between my-2'>
                    <button className={calcType === 'mixed' ? 'btn btn-s bg-highlight mx-2' : ' mx-2 btn btn-s border'}
                      onClick={() => this.switchCalc('mixed')}
                      >Пересорт</button>
                    <button className={calcType === 'larch' ? 'btn btn-s bg-highlight mx-2' : ' mx-2 btn btn-s border'} 
                      onClick={() => this.switchCalc('larch')}>
                      все листвяк</button>
                    <button className={calcType === 'pine' ? 'btn btn-s bg-highlight mx-2' : ' mx-2 btn btn-s border'} 
                      onClick={() => this.switchCalc('pine')}>
                      все сосна</button>
                  </div>
                  <TimberTable timbers={timbers} calcRowAndTotal={this.calcRowAndTotal} totalQnty={totalQnty}
                    calcType={calcType} totalVolume={totalVolume}/>
                </div>
                {totalQnty > 0 && 
                  <div className='content mt-0'>
                    <button   
                      onClick={this.preSave}
                      className='btn btn-center-xl btn-xxl text-uppercase font-900 bg-highlight rounded-sm shadow-l'>
                      Далее
                    </button>
                  </div>
                }
              </div>
            }
      </div>
    )
  }
}