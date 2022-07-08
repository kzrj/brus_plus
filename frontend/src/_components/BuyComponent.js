import React, { useRef, useState  } from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getObjectbyId } from './utils';


function LumberInputs (props) {
  const { lumber, calcRowQnty, calcRowCash } = props
  return (
    <div className=''>
      <div className='d-flex justify-content-start '>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense" 
          variant="outlined" 
          label='Количество'
          type='number'
          onChange={(e) => calcRowQnty(e, lumber.id)}
          value={lumber.quantity > 0 && lumber.quantity}/>

        <span>{lumber.volume_total}</span>
        {/* <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          label='Объем'
          type='number'
          onChange={(e) => calcRowVolume(e, lumber.id)}
          value={lumber.volume_total > 0 && lumber.volume_total}/> */}
      </div>
      <div className='d-flex justify-content-start mt-2'>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          label='Цена за 1м3'
          type='number'
          onChange={(e) => calcRowCash(e, lumber.id)}
          value={lumber.employee_rate > 0 && lumber.employee_rate}/>

        <span>{lumber.selling_total_cash > 0 && lumber.selling_total_cash}</span>
        {/* <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          disabled
          label='Сумма'
          type='number'
          value={lumber.selling_total_cash > 0 && lumber.selling_total_cash}/> */}
      </div>
    </div>
  )
}

export function LumberOptGroup (props) {
  const { woodSpecie, lumberType, pineBrus, pineDoska, larchBrus, larchDoska } = props
  let lumberOptions = []
  if (woodSpecie === 'pine' && lumberType === 'brus') lumberOptions = pineBrus
  if (woodSpecie === 'pine' && lumberType === 'doska') lumberOptions = pineDoska
  if (woodSpecie === 'larch' && lumberType === 'brus') lumberOptions = larchBrus
  if (woodSpecie === 'larch' && lumberType === 'doska') lumberOptions = larchDoska
  
  return (
    <optgroup label>
      {lumberOptions.map(lumber =>
        <option value={lumber.id} >{`${lumber.name} ${lumber.wood_species}`} </option>
        )}
    </optgroup>
  )
}

export function LumberToBuy (props) {
  const { lumber, lumbers, addLumber, delLumber } = props

  const lumberRef = useRef(null);
  const executeScroll = () => lumberRef.current.scrollIntoView()
  
  const woodSpecies = [['pine', 'сосна'], ['larch', 'лиственница']]
  const [currentWoodSpecies, setCurrentWoodSpecies] = useState('pine');

  const lumberTypes = [['brus', 'брус'], ['doska', 'доска']]
  const [currentLumberType, setCurrentLumberType] = useState('brus');

  const filterBtnClass = 'btn btn-m border w-100 mx-2'

  const pineBrus = lumbers.filter(l => l.wood_species === 'pine' && l.lumber_type === 'brus');
  const pineDoska = lumbers.filter(l => l.wood_species === 'pine' && l.lumber_type === 'doska');

  const larchBrus = lumbers.filter(l => l.wood_species === 'larch' && l.lumber_type === 'brus');
  const larchDoska = lumbers.filter(l => l.wood_species === 'larch' && l.lumber_type === 'doska');
  
  return (
    <div className='mx-2 mt-2 mb-3 px-2 py-3 bg-white rounded-m border' ref={lumberRef}>
      <InputLabel htmlFor="grouped-native-select" className='font-19 font-600 color-black text-center'>
        Пиломатериал {lumber.id + 1}
      </InputLabel>

      <div className='d-flex justify-content-around my-2'>
        {woodSpecies.map(woodSpecie =>
          <button className={woodSpecie[0] === currentWoodSpecies ? filterBtnClass + ' bg-green2-light' 
            : filterBtnClass} 
            onClick={() => setCurrentWoodSpecies(woodSpecie[0])}>
            {woodSpecie[1]}
          </button>
        )}
      </div>

      <div className='d-flex justify-content-around mb-2'>
        {lumberTypes.map(lumberType =>
          <button className={lumberType[0] === currentLumberType ? filterBtnClass + ' bg-yellow1-light' 
            : filterBtnClass} 
            onClick={() => setCurrentLumberType(lumberType[0])}>
            {lumberType[1]}
          </button>
        )}
      </div>

      <Select 
        native 
        defaultValue="" 
        className='mx-2 my-2 color-dark1-light w-100'
        value={lumber.lumber} onChange={(e) => addLumber(e, lumber.id)}
        name='lumber'
        data-id={lumber.id}
        onClick={executeScroll}
        >
        <option aria-label="None" />
        <LumberOptGroup woodSpecie={currentWoodSpecies} lumberType={currentLumberType}
          pineBrus={pineBrus} pineDoska={pineDoska} larchBrus={larchBrus} larchDoska={larchDoska} />
      </Select>

      {lumber.lumber > 0 && 
        <button className='btn btn-sm bg-red2-light mt-2 ' onClick={() => delLumber(lumber.id)}>удалить</button>
      }
    </div>
  )
}

