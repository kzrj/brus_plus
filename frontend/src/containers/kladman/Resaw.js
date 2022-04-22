import axios from 'axios';

import React, { Component } from 'react';

import endpoints from '../../redux/api/endpoints';
import { replaceItemInDictArrayById, getObjectbyId, toggleArrayDictById, lodashToggle } 
  from '../../components/utils';

import {  ResawToCreate, CreatedResaw, ResawInput }  from '../../components/kladman/Resaw';


export class ResawContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pineBrus: [],
      larchBrus: [],
      pineDoska: [],
      larchDoska: [],
      
      lumber_in: null,
      lumber_in_quantity: null,
      lumber_out: null,
      lumber_out_quantity: null,

      createdResaw: null,
      dataToSave: null,
    }

    this.setLumber = this.setLumber.bind(this);
    this.preSave = this.preSave.bind(this);
    this.saveData = this.saveData.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    
    axios({
      method: 'get',
      url: endpoints.KLADMAN_SALE_INIT_DATA,
      headers: { 'Authorization': `JWT ${token}` }
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        pineBrus: initData.pine_brus_lumbers,
        larchBrus: initData.larch_brus_lumbers,
        pineDoska: initData.pine_doska_lumbers,
        larchDoska: initData.larch_doska_lumbers,
        lumbers: initData.lumbers,
        });
    })
  }

  setLumber (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state)
  }

  preSave () {
    const { lumber_in, lumber_in_quantity, lumber_out, lumber_out_quantity } = this.state
    
    let data = {
      lumber_in: lumber_in,
      lumber_in_quantity: lumber_in_quantity,
      lumber_out: lumber_out,
      lumber_out_quantity: lumber_out_quantity,
    }
    console.log(data)

    this.setState({
      dataToSave: data,
    })
  }

  saveData () {
    const { dataToSave } = this.state
    const token = localStorage.getItem('token');
    
    axios({
      method: 'post',
      url: endpoints.KLADMAN_RESAW_CREATE,
      data: dataToSave,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: response.data.message, createdResaw: response.data.created });
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
    const { createdResaw, dataToSave, message } = this.state
    return (
      <div className=''>
        {createdResaw 
          ? <CreatedResaw resaw={createdResaw} message={message}/>
          : dataToSave
            ? <ResawToCreate resaw={dataToSave} saveData={this.saveData} back={this.back} 
                lumbers={this.state.lumbers}/>
            : <div className='card card-style mt-3'>
                <div className='content'>
                  <ResawInput 
                    lumber={this.state.lumber_in}
                    quantity={this.state.lumber_in_quantity}
                    setLumber={this.setLumber}
                    pineBrus={this.state.pineBrus}
                    pineDoska={this.state.pineDoska}
                    larchBrus={this.state.larchBrus}
                    larchDoska={this.state.larchDoska}

                    label={'Что перепиливаем?'}
                    lumber_input_label={'lumber_in'}
                  />
                  <div className='mt-3'>
                    <ResawInput 
                      lumber={this.state.lumber_out}
                      quantity={this.state.lumber_out_quantity}
                      setLumber={this.setLumber}
                      pineBrus={this.state.pineBrus}
                      pineDoska={this.state.pineDoska}
                      larchBrus={this.state.larchBrus}
                      larchDoska={this.state.larchDoska}

                      label={'Что получаем?'}
                      lumber_input_label={'lumber_out'}
                    />
                  </div>
                  <button className='btn btn-l bg-highlight mt-3' onClick={this.preSave}>
                    Далее
                  </button>
                </div>
              </div>
          }
      </div>
    )
  }
}