import axios from 'axios';

import React, { Component } from 'react';
import { useHistory  } from "react-router-dom";

import endpoints from '../../redux/api/endpoints';

import { LastOperations } from '../manager/RamshikPayments';


function ShiftListButton () {
  let history = useHistory();

  const redirect = () => {
    history.push('/ramshik/shift/list/')
  }
  return (
    <div className='card card-style mb-2'>
      <div className='content'>
        <h4 className='text-center' onClick={redirect}>
          Список смен
        </h4>
      </div>
    </div>
  )
}


export class RamshikOverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      last_payouts: [],
      ramshik: null,

      message: null,
      error: null,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    axios({
      method: 'get',
      url: endpoints.RAMSHIK_PAYOUTS,
      headers: {'Authorization': `JWT ${token}` }
    })
    .then(res => {
      const initData = res.data;
      this.setState({ ...this.state, ramshik: initData.ramshik, last_payouts: initData.last_payouts });
    })
  }

  render() {
    const { ramshik, message, last_payouts } = this.state
    return (
      <div className='mt-2'>
        <ShiftListButton />
        <div className='card card-style mb-2'>
          <div className='content'>
            <h4 className='text-center'>Текущий баланс {ramshik && ramshik.cash +  ' руб'}</h4>
          </div>
        </div>
        <LastOperations lastOperations={last_payouts} />
      </div>
    )
  }
}