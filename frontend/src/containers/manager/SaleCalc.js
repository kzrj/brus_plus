import axios from 'axios';

import React, { Component } from 'react';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, getObjectbyId, toggleArrayDictById } 
  from '../../components/utils';

import { LumbersToSale } from '../../components/kladman/SaleCalc';


export class SaleCalcContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pineBrus: [],
      pineDoska: [],
      lumbers: [],

      lumberToSale: null,
      lumbersToSale: [],

      totalCash: 0,
      totalVolume: 0
    }
    this.addLumberToSale = this.addLumberToSale.bind(this);
    this.setLumberID = this.setLumberID.bind(this);
    this.turnCalc = this.turnCalc.bind(this);

    this.calcRowQnty = this.calcRowQnty.bind(this);
    this.calcRowVolume = this.calcRowVolume.bind(this);
    this.calcRowCash = this.calcRowCash.bind(this);
    
    this.calcRoundRowQnty = this.calcRoundRowQnty.bind(this);
    this.calcRoundRowVolume = this.calcRoundRowVolume.bind(this);

    this.calcChinaRowQnty = this.calcChinaRowQnty.bind(this);
    this.calcChinaRowVolume = this.calcChinaRowVolume.bind(this);

    this.calcTotal = this.calcTotal.bind(this);
    this.delLumber = this.delLumber.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    
    axios({
      method: 'get',
      url: endpoints.SALE_CALC_DATA,
      headers: { 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        pineBrus: initData.pine_brus_lumbers,
        pineDoska: initData.pine_doska_lumbers,
        lumbers: initData.lumbers,
        });
    })
  }

  addLumberToSale () {
    this.setState({
      ...this.state,
      lumbersToSale: [
        ...this.state.lumbersToSale,
        {id: this.state.lumbersToSale.length}
      ]
    })
  }

  setLumberID (e, id) {
    let { lumbersToSale, lumbers } = this.state
    let lumberData = getObjectbyId(lumbers, e.target.value)
    lumberData = { ...lumberData, id: id, calcType: 'exact' }
    
    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumberData)
    
    this.setState({
      lumbersToSale: lumbersToSale
    })
  }

  calcRowQnty (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.quantity =  e.target.value ? parseInt(e.target.value) : 0
    lumber.volume_total = (lumber.volume * lumber.quantity).toFixed(4)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcRowVolume (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.volume_total =  e.target.value ? parseFloat(e.target.value) : 0
    lumber.quantity = (lumber.volume_total / lumber.volume).toFixed(4)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcRowCash (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.price =  e.target.value ? parseInt(e.target.value) : 0
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)

    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcRoundRowQnty (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.quantity =  e.target.value ? parseInt(e.target.value) : 0
    lumber.volume_total = (lumber.round_volume * lumber.quantity).toFixed(4)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcRoundRowVolume (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.volume_total =  e.target.value ? parseFloat(e.target.value) : 0
    lumber.quantity = (lumber.volume_total / lumber.round_volume).toFixed(0)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcChinaRowQnty (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.quantity =  e.target.value ? parseInt(e.target.value) : 0
    lumber.volume_total = (lumber.china_volume * lumber.quantity).toFixed(4)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcChinaRowVolume (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.volume_total =  e.target.value ? parseFloat(e.target.value) : 0
    lumber.quantity = (lumber.volume_total / lumber.china_volume).toFixed(0)
    lumber.total_cash = (lumber.volume_total * lumber.price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  turnCalc (id, calcType) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)

    if (calcType === 'round') {
      lumber.volume_total = (lumber.quantity * lumber.round_volume).toFixed(3)
    } 

    if (calcType === 'exact') {
      lumber.volume_total = (lumber.quantity * lumber.volume).toFixed(4)
    }

    if (calcType === 'china') {
      lumber.volume_total = (lumber.quantity * lumber.china_volume).toFixed(4)
      lumber.price = 0
    }

    lumber.calcType = calcType
    lumber.total_cash = lumber.volume_total * lumber.price

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)

    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  calcTotal (lumbers) {
    let totalCash = 0
    let totalVolume = 0.0

    lumbers.map(lumber => {
      totalCash += parseInt(lumber.total_cash)
      totalVolume += parseFloat(lumber.volume_total)
    })
    return { totalCash: totalCash.toFixed(0), totalVolume: totalVolume.toFixed(4) }
  }

  delLumber (id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumbersToSale = toggleArrayDictById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)

    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }
 
  render() {
    const { lumbersToSale, totalVolume, totalCash } = this.state
    return (
      <div className=''>
        <div className='content'>
          <h3>Калькулятор</h3> 
          {lumbersToSale.length > 0  && lumbersToSale.map(lumber => lumber &&
            <LumbersToSale 
              lumber={lumber} 
              setLumberID={this.setLumberID} 

              calcRowQnty={this.calcRowQnty}
              calcRowCash={this.calcRowCash}
              calcRowVolume={this.calcRowVolume}

              calcRoundRowQnty={this.calcRoundRowQnty}
              calcRoundRowVolume={this.calcRoundRowVolume}

              calcChinaRowQnty={this.calcChinaRowQnty}
              calcChinaRowVolume={this.calcChinaRowVolume}
              
              turnCalc={this.turnCalc}
              delLumber={this.delLumber}
              pineBrus={this.state.pineBrus}
              pineDoska={this.state.pineDoska}
            />
          )}
          <div className='d-flex justify-content-center'>
            <button className='mt-1 btn btn-l bg-highlight' onClick={this.addLumberToSale}>
              Добавить пиломатериал
            </button>
          </div>
          {totalCash > 0 &&
            <div className='card card-style mt-2'>
              <div className='content d-flex justify-content-between mb-2 '>
                <p className='font-20'>Общий объем: {totalVolume} м3</p>
                <p className='font-20'>Итого сумма: {totalCash} рублей</p>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}