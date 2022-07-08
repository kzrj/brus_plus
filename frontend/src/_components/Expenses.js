import React, { Component, useState  } from 'react';

import TextField from '@material-ui/core/TextField';

export function ExpensesList (props) {
  const { expenses, deleteExpense } = props

  return (
    <div>
      <table className='table table-sm'>
        <thead>
          <th>Сумма</th>
          <th>Примечание</th>
        </thead>
        <tbody>
          {expenses.length > 0 && expenses.map(expense =>
          <tr>
            <td>
              {expense.amount} руб
            </td>
            <td>
              {expense.note}
            </td>
            
            <td>
              <button className='btn btn-s bg-red1-light' onClick={() => deleteExpense(expense.id)}>
                Удалить
              </button>
            </td>
            
          </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export function CreateExpense (props) {
  const [amount, setCount] = useState();
  const [note, setNote] = useState('');

  return (
    <div className=''>
      <TextField 
          className='mb-2'
          id="outlined-margin-dense" 
          variant="outlined" 
          fullWidth
          label='Сумма'
          type='number'
          onChange={(e) => setCount(e.target.value)}
          value={amount}/>
      <TextField 
          className='mb-2'
          id="outlined-margin-dense" 
          variant="outlined" 
          fullWidth
          label='Примечание'
          type='text'
          onChange={(e) => setNote(e.target.value)}
          value={note}/>
      <button className='btn btn-m bg-highlight mt-2' 
        onClick={() => props.createExpense({amount: amount, note: note})}>
        Записать
      </button>
    </div>
  )
}