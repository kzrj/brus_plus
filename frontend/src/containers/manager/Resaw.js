import axios from 'axios';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/endpoints';
import { createUrlParamsFromFilters } from '../../redux/api/utils';
import { replaceItemInDictArrayById, getObjectbyId, toggleArrayDictById, lodashToggle } 
  from '../../components/utils';

import {  ResawToCreate, CreatedResaw, ResawInput, ResawList }  from '../../components/kladman/Resaw';


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

      resawsList: []
    }

    this.setLumber = this.setLumber.bind(this);
    this.preSave = this.preSave.bind(this);
    this.saveData = this.saveData.bind(this);
    this.deleteResaw = this.deleteResaw.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    
    axios({
      method: 'get',
      url: endpoints.MANAGER_SALE_INIT_DATA,
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

    axios({
      method: 'get',
      url: endpoints.RESAWS,
      headers: { 'Authorization': `JWT ${token}` },
      params: createUrlParamsFromFilters({shop: this.props.shopToSee.id})
    })
    .then(res => {
      const initData = res.data;
      this.setState({ 
        resawsList: initData.results,
        });
    })
  }

  setLumber (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  preSave () {
    const { lumber_in, lumber_in_quantity, lumber_out, lumber_out_quantity } = this.state
    
    let data = {
      lumber_in: lumber_in,
      lumber_in_quantity: lumber_in_quantity,
      lumber_out: lumber_out,
      lumber_out_quantity: lumber_out_quantity,
      shop: this.props.shopToSee.id
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
      url: endpoints.MANAGER_RESAW_CREATE,
      data: dataToSave,
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ message: response.data.message, createdResaw: response.data.created, 
        resawsList: response.data.resaws });
    })
    .catch(err => {
        // const error = new Error(err);
        // error.data = parseErrorData(err);
        this.setState({ message: 'Ошибка' });
        // throw error;
    })
  }

  deleteResaw (id) {
    const token = localStorage.getItem('token');

    axios({
      method: 'delete',
      url: endpoints.manager_delete_resaw(id),
      headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
    })
    .then(response => {
      this.setState({ resawsList: response.data.resaws });
    })
  }

  back () {
    this.setState({dataToSave: null})
  }
 
  render() {
    const { createdResaw, dataToSave, message, resawsList } = this.state
    const { user, shopToSee } = this.props
    return (
      <div className=''>
        {createdResaw
          ? <CreatedResaw resaw={createdResaw} message={message}/>
          : dataToSave
            ? <ResawToCreate resaw={dataToSave} saveData={this.saveData} back={this.back} 
                lumbers={this.state.lumbers}/>
            : (user.is_boss || user.is_capo ) &&
              <div className='card card-style mt-3'>
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
        <ResawList list={resawsList} deleteResaw={this.deleteResaw} user={user}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResawContainer);