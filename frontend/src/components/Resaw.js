import React, { } from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

import { getObjectbyId } from './utils';

export function ResawInput (props) {
  const { lumber, quantity, setLumber, pineBrus, pineDoska, larchBrus, larchDoska, label, lumber_input_label } = props
  let lumber_input_quantity_label = lumber_input_label + "_quantity"

  return (
    <div className=''>
      <InputLabel htmlFor="grouped-native-select" className='font-19 font-600 color-black'>
        {label}
      </InputLabel>
      <Select 
        native 
        defaultValue="" 
        id="grouped-native-select" 
        className='color-dark1-light'
        fullWidth
        value={lumber} 
        onChange={setLumber}
        name={lumber_input_label}
        >
        <option aria-label="None" />
        <optgroup label="Брус сосна">
          {pineBrus.map(pb =>
            <option value={pb.id} >{`${pb.name} ${pb.wood_species}`} </option>
            )}
        </optgroup>
        <optgroup label="Брус лиственница">
          {larchBrus.map(lb =>
            <option value={lb.id} >{`${lb.name} ${lb.wood_species}`} </option>
            )}
        </optgroup>
        <optgroup label="Доска сосна">
          {pineDoska.map(pd =>
            <option value={pd.id} >{`${pd.name} ${pd.wood_species}`} </option>
            )}
        </optgroup>
        <optgroup label="Доска лиственница">
          {larchDoska.map(ld =>
            <option value={ld.id} >{`${ld.name} ${ld.wood_species}`} </option>
            )}
        </optgroup>
      </Select>
      <TextField 
        className='mt-3'
        id="outlined-margin-dense"
        variant="outlined" 
        label='Количество'
        type='number'
        name={lumber_input_quantity_label}
        onChange={setLumber}
        value={quantity}/>
    </div>
  )
}

export function CreatedResaw (props) {
  const { resaw, message } = props
  const rowClass = 'mb-1 font-15 font-400 color-black'
  return (
    <div className='card card-style mt-2'>
      <div className='content'>
        <h4>Запись сохранена</h4>
        {resaw &&
          <div className=''>            
            <p className={rowClass}>Дата: {resaw.created_at}</p>
            
            <p className={rowClass}>Перепелили: {resaw.lumber_in_quantity}шт {resaw.lumber_in} </p>
            <p className={rowClass}>Получили: {resaw.lumber_out_quantity}шт {resaw.lumber_out} </p>
          </div>
        }
        {message &&
          <h2 className='color-green1-light text-center'>Данные сохранены!</h2> 
        }
      </div>
    </div>
  )
}

export function ResawToCreate (props) {
  const { resaw, saveData, back, lumbers } = props
  let lumberIn = getObjectbyId(lumbers, resaw.lumber_in)
  let lumberOut = getObjectbyId(lumbers, resaw.lumber_out)
  const rowClass = 'mb-1 font-15 font-400 color-black'

  return (
    <div className='card card-style mt-2'>
      <div className='content'>
        <h4>Проверяем данные</h4>
        {resaw &&
          <div className=''>
            <p className={rowClass}>Перепиливаем : {lumberIn.name} {resaw.lumber_in_quantity} шт</p>
            <p className={rowClass}>Получаем : {lumberOut.name} {resaw.lumber_out_quantity} шт</p>
          </div>
        }
        <div className='d-flex justify-content-around'>
          <button onClick={back}
            className='btn btn-s mr-2 text-uppercase font-900 bg-dark color-white rounded-sm shadow-l'>
            назад
          </button>
          <button onClick={saveData}
            className='btn btn-s text-uppercase font-900 bg-highlight rounded-sm shadow-l mt-2'>
              Сохранить данные
          </button>
        </div>
      </div>
    </div>
  )
}

export function ResawList (props) {
  const { list, deleteResaw, user } = props
  return (
    <div className='card card-style mt-2'>
      <div className='content'>
        <table className='table table-sm' style={{lineHeight: '15px'}}>
          <thead>
            <th>
              дата\кто записал
            </th>
            <th>
              что перепиливали
            </th>
            <th>
              во что перепилили
            </th>
          </thead>
          <tbody>
            {list.length > 0 && list.map(rsw => 
              <tr>
                <td>
                  <span className='d-block'>{rsw.created_at}</span>
                  <span className='font-600'>{rsw.who}</span>
                </td>
                <td>
                  <span className='d-block'>{rsw.lumber_in_quantity}шт {rsw.lumber_in}</span>
                  <span className='font-italic'>{rsw.lumber_in_wood_species}</span>
                </td>
                <td>
                  <span className='d-block'>{rsw.lumber_out_quantity}шт {rsw.lumber_out}</span>
                  <span className='font-italic'>{rsw.lumber_out_wood_species}</span>
                </td>
                {(user.is_manager) &&
                  <td className='mr-3'>
                    <button className='btn btn-s bg-red1-light mr-2 text-uppercase' 
                    onClick={() => deleteResaw(rsw.id)}>
                      удалить</button>
                  </td>
                }
              </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  )
}