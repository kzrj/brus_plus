import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, getObjectbyId } from '../../components/utils';
import { createUrlParamsFromFilters } from '../../redux/api/utils';


function TrRow (props) {
  let { lumber, showNull, changeMarketCost, user } = props
  let show = true
  if (lumber.current_stock_quantity == 0 && !showNull) {
    show = false
  }
  let wood_species = lumber.wood_species === 'pine' ? 'сосна' : 'лиственница'
  let woodSpeciesClass = wood_species === 'сосна' ? 'color-green1-light' : 'color-brown1-light'
  return (
    show &&
      <tr>
        <td>
          {lumber.name}
          <span className={'d-block font-italic font-500 ' + woodSpeciesClass}>{wood_species}</span>
        </td>
        <td>
          <span className='font-16'>{lumber.current_stock_volume.toFixed(4)}</span>
          <span className='d-block'>м3</span>
        </td>
        <td>
          <span className='font-16'>{lumber.current_stock_quantity}</span>
          шт
        </td>
        <td>
          {user.is_boss &&
            <TextField type='number' 
              className=''
              value={lumber.market_cost > 0 && lumber.market_cost} 
              onChange={(e) => changeMarketCost(e, lumber.id)}/>
          }
          {user.is_kladman && <span className='font-16'>{lumber.market_cost}</span>}
        </td>
        <td>
          <span className='font-16'>
            {lumber.stock_total_cash.toFixed(0)}</span>
            р
        </td>
      </tr>
  )
}

export class ManagerStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lumbers: [],
      showNull: false,

      message: null,
      error: null,
    }
    this.changeMarketCost = this.changeMarketCost.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    // console.log(this.props.ramaToSee)
    const params = createUrlParamsFromFilters({rama: this.props.ramaToSee.id});
    axios({
      method: 'get',
      url: endpoints.STOCK,
      params: params,
      headers: {'Authorization': `JWT ${token}` }
    })
    .then(res => {
      this.setState({ lumbers: res.data.results });
    })
  }

  changeMarketCost (e, lumberId) {
    let { lumbers } = this.state
    let lumber = getObjectbyId(lumbers, lumberId)
   
    const token = localStorage.getItem('token');
    axios({
      method: 'post',
      url: endpoints.MANAGER_STOCK_SET_LUMBER_PRICE,
      data: {
        lumber: lumberId,
        market_cost: parseInt(e.target.value) || 0
      },
      headers: {'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      lumber = res.data;
    })

    lumber.market_cost = parseInt(e.target.value) || 0
    lumber.stock_total_cash = lumber.market_cost * lumber.current_stock_volume

    lumbers = replaceItemInDictArrayById(lumbers, lumber)
    this.setState({
      lumbers: lumbers
    })
  }

  render() {
    const { lumbers, showNull } = this.state
    let totalVolume = 0
    let totalCash = 0
    lumbers.map(lumber => {
      totalVolume += lumber.current_stock_volume
      totalCash += lumber.stock_total_cash
    })
    return (
      <div className='mt-2'>
        <div className='card card-style mb-2'>
          <div className='content'>
            <div className='d-flex justify-content-between'>
              <h4 className='mb-2'>Склад</h4>
              <div className='my-0'>
                <label>Показать нулевые значения</label>
                <Switch
                  checked={this.state.showNull}
                  onChange={() => this.setState({showNull: !this.state.showNull})}
                  name="showNull"
                />
              </div>
            </div>
            <div className='d-flex justify-content-start'>
              {lumbers.length > 0 &&
                <table className='table table-sm table-responsive' style={{lineHeight: '17px'}}>
                  <thead>
                    <th>пиломат</th>
                    <th>объем</th>
                    <th>кол-во</th>
                    <th>цена за 1м3</th>
                    <th>стоимоcть общая</th>
                  </thead>
                  <tbody>
                    {lumbers.map(lumber =>
                      <TrRow lumber={lumber} showNull={showNull} changeMarketCost={this.changeMarketCost}
                        user={this.props.user}/>
                      )}
                    <tr>
                      <td><span className='font-16 font-500'>Итого</span></td>
                      <td>
                        <span className='font-16 font-500'>{totalVolume.toFixed(3)}</span>
                        <span className='d-block'>м3</span>
                      </td>
                      <td></td>
                      <td></td>
                      <td>
                        <span className='font-16 font-500'>{totalCash.toFixed(0)}</span>
                        <span className='d-block'>рублей</span>
                        </td>
                    </tr>
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  user: state.auth.user,
  ramaToSee: state.auth.ramaToSee
})

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerStock);