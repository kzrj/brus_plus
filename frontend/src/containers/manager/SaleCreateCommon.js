import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { createUrlParamsFromFilters } from '../../redux/api/utils';
import { replaceItemInDictArrayById, getObjectbyId, toggleArrayDictById, lodashToggle } 
  from '../../components/utils';

import { LumbersToSale, SaleCheckList, SaleCommonToCreate, CreatedSale } 
  from '../../components/kladman/SaleCommon';


export class SaleCreateCommonContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pineBrus: [],
      larchBrus: [],
      pineDoska: [],
      larchDoska: [],
      lumbers: [],

      sellers: [],
      seller: null,
      bonus_kladman: null,
      bonus_kladman_label: false,
      loader: false,
      client: '',
      china_vira: 0,
      delivery_fee: 0,

      lumbersToSale: [],

      createdSale: null,
      dataToSave: null,

      message: null,
      error: null,

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

    this.setRamaPrice = this.setRamaPrice.bind(this);

    this.setAddParams = this.setAddParams.bind(this);
    this.setChinaVira = this.setChinaVira.bind(this);

    this.calcTotal = this.calcTotal.bind(this);
    this.delLumber = this.delLumber.bind(this);

    this.saveData = this.saveData.bind(this);
    this.preSave = this.preSave.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({stock_type: this.props.user.rama_type});
    
    axios({
      method: 'get',
      url: endpoints.MANAGER_SALE_INIT_DATA,
      headers: { 'Authorization': `JWT ${token}` },
      params: params
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        pineBrus: initData.pine_brus_lumbers,
        larchBrus: initData.larch_brus_lumbers,
        pineDoska: initData.pine_doska_lumbers,
        larchDoska: initData.larch_doska_lumbers,
        lumbers: initData.lumbers,
        sellers: initData.sellers,
        bonus_kladman: initData.kladman_id
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
    lumberData = { ...lumberData, id: id, }
    
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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_price =  e.target.value ? parseInt(e.target.value) : 0
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

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
    lumber.selling_total_cash = (lumber.volume_total * lumber.selling_price).toFixed(0)

    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    const { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    
    this.setState({
      lumbersToSale: lumbersToSale,
      totalCash: totalCash,
      totalVolume: totalVolume
    })
  }

  setRamaPrice (e, id) {
    let { lumbersToSale } = this.state
    let lumber = getObjectbyId(lumbersToSale, id)
    lumber.rama_price =  e.target.value ? parseFloat(e.target.value) : 0
    lumbersToSale = replaceItemInDictArrayById(lumbersToSale, lumber)
    
    this.setState({
      lumbersToSale: lumbersToSale,
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
      lumber.selling_price = 0
    }

    lumber.calc_type = calcType
    lumber.selling_total_cash = lumber.volume_total * lumber.selling_price

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
      totalCash += parseInt(lumber.selling_total_cash)
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

  setAddParams(e) {
    if (e.target.name === 'loader' || e.target.name === 'bonus_kladman_label')
      this.setState({[e.target.name]: !this.state[e.target.name]})
    else
      this.setState({[e.target.name]: e.target.value})
  }

  setChinaVira (e) {
    let { lumbersToSale } = this.state
    let { totalCash, totalVolume } = this.calcTotal(lumbersToSale)
    let china_vira = parseInt(e.target.value)
    if (china_vira > 0)
      totalCash -= china_vira
    
    this.setState({
      totalCash: totalCash,
      china_vira: china_vira
    })
  }

  preSave () {
    const { lumbersToSale, loader, seller, bonus_kladman_label, bonus_kladman,
      delivery_fee, totalCash, totalVolume, client, china_vira } = this.state
    let raw_records = []
    lumbersToSale.map(lumber =>{
      if (lumber.selling_total_cash > 0 && lumber.quantity > 0) {
        raw_records = lodashToggle(raw_records, lumber)
      }
    })

    let data = {
      raw_records: raw_records,
      date: null,
      loader: loader,
      seller: seller,
      bonus_kladman: bonus_kladman_label ? bonus_kladman : null,
      client: client,
      delivery_fee: delivery_fee,

      sale_cash: parseFloat(totalCash),
      volume: parseFloat(totalVolume),
      china_vira: china_vira
    }
    this.setState({
      dataToSave: data,
    })
  }

  saveData () {
    const { dataToSave } = this.state
    const token = localStorage.getItem('token');
    
    axios({
      method: 'post',
      url: endpoints.MANAGER_SALE_CREATE,
      data: dataToSave,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: response.data.message, createdSale: response.data.sale });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })
  }

  back () {
    this.setState({dataToSave: null})
  }
 
  render() {
    const { lumbersToSale, totalVolume, totalCash, createdSale, dataToSave, message } = this.state
    return (
      <div className=''>
        {createdSale 
          ? <CreatedSale sale={createdSale} message={message}/>
          : dataToSave
            ? <SaleCommonToCreate sale={dataToSave} saveData={this.saveData} back={this.back} 
              sellers={this.state.sellers}/>
            : <div >
                <div className='content'>
                  <h3>Что продаем?</h3> 
                  {lumbersToSale.length > 0  && lumbersToSale.map(lumber => lumber &&
                    <LumbersToSale
                      stockType={this.props.user.rama_type}
                      lumber={lumber} 
                      setLumberID={this.setLumberID} 

                      calcRowQnty={this.calcRowQnty}
                      calcRowCash={this.calcRowCash}
                      calcRowVolume={this.calcRowVolume}

                      calcRoundRowQnty={this.calcRoundRowQnty}
                      calcRoundRowVolume={this.calcRoundRowVolume}

                      calcChinaRowQnty={this.calcChinaRowQnty}
                      calcChinaRowVolume={this.calcChinaRowVolume}

                      setRamaPrice={this.setRamaPrice}

                      turnCalc={this.turnCalc}
                      delLumber={this.delLumber}
                      pineBrus={this.state.pineBrus}
                      larchBrus={this.state.larchBrus}
                      pineDoska={this.state.pineDoska}
                      larchDoska={this.state.larchDoska}
                    />
                  )}
                  <div className='d-flex justify-content-center'>
                    <button className='mt-1 btn btn-l bg-highlight' onClick={this.addLumberToSale}>
                      Добавить пиломатериал
                    </button>
                  </div>
                </div>
                {totalCash > 0 &&
                  <div className='card card-style mt-2'>
                    <div className='content'>
                      <div className='d-flex justify-content-between'>
                        <p className='font-15 mb-0'>Объем: {totalVolume} м3</p>
                        <p className='font-15 mb-0'>Итого: {totalCash} р</p>
                      </div>          
                      <SaleCheckList 
                        setAddParams={this.setAddParams} 
                        sellers={this.state.sellers}
                        seller={this.state.seller}
                        bonus_kladman_label={this.state.bonus_kladman_label}
                        loader={this.state.loader}
                        client={this.state.client}
                        delivery_fee={this.state.delivery_fee}

                        china_vira={this.state.china_vira}
                        setChinaVira={this.setChinaVira}

                        preSave={this.preSave}
                      />
                    </div>
                  </div>
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
  state: state
});


const mapDispatchToProps = dispatch => ({
  // checkAuth: (groups) => dispatch(authActions.checkAuthRequest(groups))
  // auth
  // checkToken: (token) => dispatch(AuthActions.checkTokenRequest(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleCreateCommonContainer);