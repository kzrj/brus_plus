import React, { Component, useState } from 'react';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

import endpoints from '../../redux/api/suppliersPageApi';

const suppliersApi = endpoints.create();


export function LastOperations (props){
  const { lastOperations } = props
  return (
    <div className='card card-style mt-0'>
      <div className='content'>
        <h4>Последние операции</h4>
        {lastOperations.length > 0 
        ? <table className='table table-sm table-responsive' style={{lineHeight: '16px'}}>
            <thead className=''>
              <th>Дата</th>
              <th>Тип</th>
              <th>Поставщик</th>
              <th>Сумма</th>
            </thead>
            <tbody>
              {lastOperations.map(op => 
                <tr>
                  <td className='text-nowrap'>{op.created_at}</td>
                  <td>
                    {op.record_type === 'withdraw_employee' 
                      ? 'Оплата поставщику' : 'Долг поставщику с прихода'}
                  </td>
                  <td>{op.employee}</td>
                  <td className={op.record_type === 'withdraw_employee' 
                      ? 'color-red1-light font-16' :'color-green1-light font-16'}>
                    {op.record_type === 'withdraw_employee' ? '-' + op.amount : '+' + op.amount}
                  </td>
                </tr>
                )}
            </tbody>
          </table>
        : <div>Нет операции</div>
        }
      </div>
    </div>
  )
}

function CreateRamshik (props) {
  const { newCash, newName, createRamshik, setData } = props
  const [open, setOpen] = useState(false);

  const create = () => (
    setOpen(false),
    createRamshik()
  )

  return (
    open 
      ? <div className='card card-style'>
          <div className='content'>
            <div className='  my-1'>
              <TextField type='text' name='newName' value={newName} onChange={setData} label='Имя' 
                fullWidth className='mb-2'/>
              <TextField type='number' name='newCash' value={newCash} onChange={setData} label='Баланс' fullWidth/>
            </div>
            <div className='d-flex justify-content-between mt-3'>
              <button className='btn btn-s bg-highlight' onClick={create}>Создать</button>
              <button className='btn btn-s bg-red1-light' onClick={() => setOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      : <div className='d-flex justify-content-center my-3'>
          <button className='btn btn-l bg-highlight' onClick={setOpen}>
            Создать нового поставщика
          </button>
        </div>
  )
}

class RamshikPayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      activeEmployee: null,
      amount: 0,

      last_payouts: [],

      message: null,
      error: null,

      newName: '',
      newCash: 0
    }
  }

  componentDidMount() {
    suppliersApi.getInitdata()
    .then(initData => {
        this.setState({ ...this.state, employees: initData.employees, last_payouts: initData.last_payouts });
      })
  }

  payout = () => {
    suppliersApi.payout({ activeEmployee: this.state.activeEmployee, amount: this.state.amount })
    .then(data => {
      this.setState({ ...this.state, message: data.message, employees: data.employees,
        activeEmployee: null, last_payouts: data.last_payouts
      });
    })
  }

  setData = (e) =>{
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  createRamshik = () => {
    suppliersApi.createSupplier({ nickname: this.state.newName, cash: this.state.newCash })
    .then(data => {
      this.setState({ employees: data.employees, activeEmployee: null });
    })
  }

  deleteRamshik = () => {
    suppliersApi.deleteSupplier(this.state.activeEmployee.id)
    .then(data => {
      this.setState({ employees: data.employees, activeEmployee: null });
    })
  }

  render() {
    const { employees, activeEmployee, amount, message, last_payouts } = this.state
    return (
      <div className='mt-2'>
        <div className='card card-style mb-2'>
          <div className='content'>
            <h4 className='mb-2'>Расчет поставщиков</h4>
            <div className=''>
              {employees.length > 0 &&
                  <table className='table table-sm'>
                    <thead>
                      <th>поставщик</th>
                      <th>баланс</th>
                    </thead>
                    <tbody>
                      {employees.map(employee => 
                        <tr className={activeEmployee && activeEmployee.id === employee.id && 'bg-green1-light'}
                          onClick={() => this.setState({...this.state, activeEmployee: employee, message: null})}>
                          <td>{employee.nickname}</td>
                          <td>{employee.cash} р /  {employee.cash_amount}</td>
                        </tr>
                        )}
                    </tbody>
                  </table>
              }
              {activeEmployee && 
                <div className='w-100'>
                  <span className='font-16 mr-3'>{activeEmployee.nickname}</span>
                  <span className='font-16 font-600'>{activeEmployee.cash} р</span>
                  <div className='d-flex justify-content-start mt-2 mb-4'>
                    <TextField type='number' className='mr-3' value={amount}
                      onChange={(e) => this.setState({...this.state, amount: e.target.value})} />
                    <button className='d-block btn btn-s bg-green2-light'
                      onClick={this.payout}>
                      Оплатить
                    </button>
                  </div>
                  <button className='d-block btn btn-s bg-red1-light mt-2'
                    onClick={this.deleteRamshik}>
                    Удалить поставщика
                  </button>
                </div>
              }
              {message &&
                <p className='color-dark text-center'>{message}</p>
              }
            </div>
          </div>
        </div>
        <CreateRamshik newName={this.state.newName} newCash={this.state.newCash} setData={this.setData}
          createRamshik={this.createRamshik}
          />
        <LastOperations lastOperations={last_payouts} />
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RamshikPayments);