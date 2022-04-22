import axios from 'axios';

import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import endpoints from '../../redux/api/endpoints';
import { parseErrorData } from '../../redux/api/utils';

import { ShiftList } from '../../components/Shifts';


export class RamshikShiftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftList: [],
      
      message: null,
      error: null,
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const { shiftList } = this.state
    if (shiftList.length === 0) 
      axios({
        method: 'get',
        url: endpoints.RAMSHIK_SHIFT_LIST,
        headers: {'Authorization': `JWT ${token}` }
      })
      .then(response => {
        this.setState({ ...this.state, shiftList: response.data.results });
      })
  }

  render() {
    return (
      <ShiftList shiftList={this.state.shiftList} />
    )
  }
}