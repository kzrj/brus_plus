import React, { Component, useRef  } from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'


function LumberInputs (props) {
  const { lumber, calcRowQnty, calcRowVolume, calcRowCash, label } = props
  return (
    <div className='my-2'>
      <h5>{label}:</h5>
      <div className='d-flex justify-content-start '>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense" 
          variant="outlined" 
          label='Количество'
          type='number'
          onChange={(e) => calcRowQnty(e, lumber.id)}
          value={lumber.quantity > 0 && lumber.quantity}/>

        <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          label='Объем'
          type='number'
          onChange={(e) => calcRowVolume(e, lumber.id)}
          value={lumber.volume_total > 0 && lumber.volume_total}/>
      </div>
      <div className='d-flex justify-content-start mt-2'>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          label='Цена за 1м3'
          type='number'
          onChange={(e) => calcRowCash(e, lumber.id)}
          value={lumber.price > 0 && lumber.price}/>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          disabled
          label='Сумма'
          type='number'
          value={lumber.total_cash > 0 && lumber.total_cash}/>
      </div>
    </div>
  )
}


export function LumbersToSale (props) {
  const { lumber, setLumberID, calcRowQnty, calcRowCash, pineBrus,  pineDoska, turnCalc, delLumber,
     calcRoundRowQnty, calcRowVolume, calcRoundRowVolume, calcChinaRowQnty, calcChinaRowVolume } = props

  const lumberRef = useRef(null);
  const executeScroll = () => lumberRef.current.scrollIntoView()

  return (
    <div className='mt-2 mb-3 px-2 py-3 bg-white rounded-m border' ref={lumberRef}>
      <InputLabel htmlFor="grouped-native-select" className='font-19 font-600 color-black'>
        Пиломатериал {lumber.id + 1}
      </InputLabel>
      <Select 
        native 
        defaultValue="" 
        id="grouped-native-select" 
        className='color-dark1-light'
        fullWidth
        value={lumber.lumber} onChange={(e) =>setLumberID(e, lumber.id)}
        name='lumber'
        data-id={lumber.id}
        defaultValue={null}
        onClick={executeScroll}
        >
        <option aria-label="None" />
        <optgroup label="Брус">
          {pineBrus.map(pb =>
            <option value={pb.id} >{`${pb.name} ${pb.wood_species}`} </option>
            )}
        </optgroup>
        <optgroup label="Доска">
          {pineDoska.map(pd =>
            <option value={pd.id} >{`${pd.name} ${pd.wood_species}`} </option>
            )}
        </optgroup>

      </Select>
      {lumber.lumber > 0 && 
        <div className='mt-2'>
          <div className='d-flex justify-content-around'>
            <button className={lumber.calcType === 'exact' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'} 
              onClick={() => turnCalc(lumber.id, 'exact')}>
              счет Т
            </button>
            <button className={lumber.calcType === 'round' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'}
              onClick={() => turnCalc(lumber.id, 'round')}>
              счет О
            </button>
            {lumber.china_volume > 0 &&
              <button className={lumber.calcType === 'china' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'}
              onClick={() => turnCalc(lumber.id, 'china')}>
                Китайский счет
            </button>
            }
          </div>
          {lumber.calcType === 'exact' &&
            <LumberInputs 
              lumber={lumber}
              label={'счет Т'} 
              calcRowQnty={calcRowQnty} 
              calcRowVolume={calcRowVolume}
              calcRowCash={calcRowCash}
            />
          }
          {lumber.calcType === 'round' &&
            <LumberInputs 
              lumber={lumber}
              label={'Счет О'} 
              calcRowQnty={calcRoundRowQnty} 
              calcRowVolume={calcRoundRowVolume}
              calcRowCash={calcRowCash}
            />            
          }
          {lumber.calcType === 'china' &&
            <LumberInputs 
              lumber={lumber}
              label={'Китайский счет'} 
              calcRowQnty={calcChinaRowQnty} 
              calcRowVolume={calcChinaRowVolume}
              calcRowCash={calcRowCash}
            />            
          }
        </div>}
      {lumber.lumber > 0 && 
        <button className='btn btn-sm bg-red2-light mt-2 ' onClick={() => delLumber(lumber.id)}>удалить</button>
      }
    </div>
  )
}