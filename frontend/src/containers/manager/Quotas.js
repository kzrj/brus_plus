import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { createUrlParamsFromFilters, parseErrorData } from '../../redux/api/utils';

import TextField from '@material-ui/core/TextField';

function QuotaDetail (props) {
  const { data, wood } = props
  return (
    <div>
      <table className='table table-sm'>
        <thead>
          <th>{wood}</th>
          <th>План</th>
          <th>Отгружено</th>
          <th>Баланс</th>
        </thead>
        <tbody>
          <tr>
            <td>Брус</td>
            <td>{data.total_volume_quota_brus} m3</td>
            <td>{data.total_volume_sold_brus} m3</td>
            <td>{data.brus_balance && data.brus_balance.toFixed(4)} m3
            </td>
          </tr>
          <tr>
            <td>Доска(без дюймовки)</td>
            <td>{data.total_volume_quota_doska} m3</td>
            <td>{data.total_volume_sold_doska} m3</td>
            <td>{data.doska_balance && data.doska_balance.toFixed(4)} m3
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


function CashRecordsList(props) {
  const { records, deletePayout, user } = props
  return (
    <table className='table table-sm table-responsive' style={{lineHeight: '13px'}}>
      <thead>
        <th>Дата</th>
        <th>Тип</th>
        <th>Кто создал</th>
        <th>Сумма</th>
      </thead>
      <tbody>
        {records.map(record =>
          <tr>
            <td className='text-nowrap'>{record.created_at}</td>
            <td>{record.record_type}</td>
            <td>{record.who}</td>
            <td className={record.record_type === 'Вывод средств от кладмэна/менеджера' 
                      ? 'color-red1-light font-16' :'color-green1-light font-16'}>{record.amount} р</td>
            {user.is_boss && 
              <td>
                <button className='btn btn-s bg-red1-light' onClick={() => deletePayout(record.id)}>
                  Удалить
                </button>
              </td>
            }
          </tr>
          )}
      </tbody>
    </table>
  )
}


class QuotaOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pine_data: null,
      larch_data: null,

      manager_balance: null,
      cash_records: [],
      amount: 0,

      message: null,
      error: null,
    }
    this.payoutToManager = this.payoutToManager.bind(this);
    this.deletePayout = this.deletePayout.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const params = createUrlParamsFromFilters({shop: this.props.shopToSee.id});
    axios({
      method: 'get',
      url: endpoints.QUOTAS,
      headers: {'Authorization': `JWT ${token}` },
      params: params
    })
    .then(res => {
      this.setState({ 
        pine_data: res.data.pine_data,
        larch_data: res.data.larch_data,
        manager_balance: res.data.manager_balance,
        cash_records: res.data.cash_records,
      });
    })
  }

  payoutToManager () {
    const { amount } = this.state
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("shop", this.props.shopToSee.id);
    formData.append("amount", amount);
        
    axios({
      method: 'post',
      url: endpoints.CAPO_BOSS_PAYOUT_MANAGER_CREATE,
      data: formData,
      headers: { 'content-type': 'multipart/form-data', 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      this.setState({ ...this.state, 
        manager_balance: res.data.manager_balance,
        cash_records: res.data.cash_records,
        amount: 0
      });
    })
    .catch(err => {
        const error = new Error(err);
        error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        throw error;
    })
  }

  deletePayout (id) {
    const token = localStorage.getItem('token');

    axios({
      method: 'delete',
      url: endpoints.boss_delete_manager_payout(id),
      headers: {'Authorization': `JWT ${token}` }
    })
    .then(res => {
      this.setState({ ...this.state, manager_balance: res.data.manager_balance,
        cash_records: res.data.cash_records,
        amount: 0 });
    })
  }

  render() {
    const { user } = this.props
    return (
      <div>
        <div className='card card-style my-2'>
          <div className='content mb-0'>
            <h4 className='mb-2'>План пилорамы</h4>
          </div>

          {this.state.pine_data &&
            <div className='content my-0'>
              <QuotaDetail data={this.state.pine_data} wood={'Сосна'}/>
            </div>
          }

          {this.state.larch_data && 
            <div className='content my-0'>
              <QuotaDetail data={this.state.larch_data} wood={'Лиственница'}/>
            </div>
          }
        </div>
        <div className='card card-style my-2'>
          <div className='content'>
            <h5 className='text-center'>Должны манагеру: 
              <span className='font-400'> {this.state.manager_balance} рублей</span>
            </h5>
            {(user.is_boss) && 
              <div className='d-flex justify-content-around mt-4'>
                <TextField type='number'
                  variant="outlined"
                  value={this.state.amount} 
                  onChange={(e) => this.setState({amount: e.target.value})}/>
                <button className='btn btn-s bg-highlight' onClick={this.payoutToManager}>
                  Выдать аванс
                </button>
              </div>
            }
          </div>
        </div>
        <div className='card card-style'>
          <div className='content'>
            <h5>Расчеты</h5>
            <CashRecordsList records={this.state.cash_records} user={user} deletePayout={this.deletePayout}/>
          </div>
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
})

const mapDispatchToProps = (dispatch) => ({
  // dispatch: dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuotaOverview);