import React, { useState, useRef  } from 'react';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

import { getObjectbyId } from '../commons/utils';

function LumberInputs (props) {
  const { lumber, calcRowQnty, calcRowVolume, calcRowCash, setRamaPrice, label } = props
  return (
    <div className=''>
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
          value={lumber.selling_price > 0 && lumber.selling_price}/>
        <TextField 
          className='pr-2'
          id="outlined-margin-dense"
          variant="outlined" 
          disabled
          label='Сумма'
          type='number'
          value={lumber.selling_total_cash > 0 && lumber.selling_total_cash}/>
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


export function LumbersToSale (props) {
  const { lumber, setLumberID, calcRowQnty, calcRowCash, pineBrus,  pineDoska, turnCalc, delLumber, larchBrus,
     calcRoundRowQnty, calcRowVolume, calcRoundRowVolume, calcChinaRowQnty, calcChinaRowVolume, setRamaPrice,
     stockType, larchDoska } = props

  const lumberRef = useRef(null);
  const executeScroll = () => lumberRef.current.scrollIntoView()

  const woodSpecies = [['pine', 'сосна'], ['larch', 'лиственница']]
  const [currentWoodSpecies, setCurrentWoodSpecies] = useState('pine');

  const lumberTypes = [['brus', 'брус'], ['doska', 'доска']]
  const [currentLumberType, setCurrentLumberType] = useState('brus');

  const filterBtnClass = 'btn btn-m border w-100 mx-2'

  return (
    <div className='mt-2 mb-3 px-2 py-3 bg-white rounded-m border' ref={lumberRef}>
      <InputLabel htmlFor="grouped-native-select" className='text-center font-19 font-600 color-black'>
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
        id="grouped-native-select" 
        className='color-dark1-light'
        fullWidth
        value={lumber.lumber} onChange={(e) =>setLumberID(e, lumber.id)}
        name='lumber'
        data-id={lumber.id}
        onClick={executeScroll}
        >
        <option aria-label="None" />
        <LumberOptGroup woodSpecie={currentWoodSpecies} lumberType={currentLumberType}
          pineBrus={pineBrus} pineDoska={pineDoska} larchBrus={larchBrus} larchDoska={larchDoska} />
      </Select>

      {lumber.lumber > 0 && 
        <div className='mt-2'>
          <div className='d-flex justify-content-around'>
            <button className={lumber.calc_type === 'exact' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'} 
              onClick={() => turnCalc(lumber.id, 'exact')}>
              счет Т
            </button>
            <button className={lumber.calc_type === 'round' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'}
              onClick={() => turnCalc(lumber.id, 'round')}>
              счет О
            </button>
            {lumber.china_volume > 0 &&
              <button className={lumber.calc_type === 'china' ? 'btn btn-m bg-blue1-light' 
              : 'btn btn-m border'}
              onClick={() => turnCalc(lumber.id, 'china')}>
                Китайский счет
            </button>
            }
          </div>
          {lumber.calc_type === 'exact' &&
            <LumberInputs 
              lumber={lumber}
              label={'Счет Т'} 
              calcRowQnty={calcRowQnty} 
              calcRowVolume={calcRowVolume}
              calcRowCash={calcRowCash}
              setRamaPrice={setRamaPrice}
            />
          }
          {lumber.calc_type === 'round' &&
            <LumberInputs 
              lumber={lumber}
              label={'Счет О'} 
              calcRowQnty={calcRoundRowQnty} 
              calcRowVolume={calcRoundRowVolume}
              calcRowCash={calcRowCash}
              setRamaPrice={setRamaPrice}
            />            
          }
          {lumber.calc_type === 'china' &&
            <LumberInputs 
              lumber={lumber}
              label={'Китайский счет'} 
              calcRowQnty={calcChinaRowQnty} 
              calcRowVolume={calcChinaRowVolume}
              calcRowCash={calcRowCash}
              setRamaPrice={setRamaPrice}
            />            
          }
        </div>}
      {lumber.lumber > 0 && 
        <button className='btn btn-sm bg-red2-light mt-2 ' onClick={() => delLumber(lumber.id)}>удалить</button>
      }
    </div>
  )
}

export function SaleCheckList (props) {
  const { setAddParams, seller, sellers, client, delivery_fee, preSave } = props

  return (
    <div>
      <div className='d-flex justify-content-between mb-1 '>
        <TextField 
          className='pr-2 pt-2'
          variant="standard" 
          label='Имя клиента'
          type='text'
          name='client'
          onChange={setAddParams}
          value={client && client}/>
        <FormControl  className='pb-4'>
          <InputLabel >Продавец</InputLabel>
          <Select 
            native 
            defaultValue="" 
            className='color-dark1-light'
            value={seller} 
            onChange={setAddParams}
            name='seller'
            >
            <option aria-label="None" />
            {sellers && sellers.length > 0 && sellers.map(s => 
              <option value={s.id} >{s.nickname} </option>
            )}
          </Select>
        </FormControl>
      </div>
      <div className='d-flex justify-content-between mb-1 '>
        <TextField 
            className='pr-2'
            id="outlined-margin-dense"
            variant="outlined" 
            label='Доставка'
            type='number'
            name='delivery_fee'
            onChange={setAddParams}
            value={delivery_fee > 0 && delivery_fee}/>
      </div>
      <button
        onClick={preSave}
        className='btn btn-center-xl btn-xxl text-uppercase font-900 bg-highlight rounded-sm 
          shadow-l mt-4'>
        Далее
      </button>
    </div>
    )
}

function LumbersTable (props) {
  const { lumber_records } = props
  return (
    <table className='table table-sm table-responsive mt-2'>
      <thead>
        <th>
          Пиломат
        </th>
        <th>
          кол-во
        </th>
        <th>
          объем
        </th>
        <th>
          цена за 1м3
        </th>
        <th>
          сумма продажи
        </th>
      </thead>
      <tbody>
        {lumber_records.map(lumber_record =>
        <tr>
          <td>{lumber_record.name}</td>
          <td>{lumber_record.quantity} шт</td>
          <td>{lumber_record.volume_total} м3</td>
          <td>{lumber_record.selling_price} руб</td>
          <td>{lumber_record.selling_total_cash} руб</td>
        </tr>
          )}
      </tbody>
    </table>
  )
}

export function CreatedSale (props) {
  const { sale, message } = props
  const rowClass = 'mb-1 font-15 font-400 color-black'
  return (
    <div className='card card-style mt-2'>
      <div className='content'>
        <h4>Запись сохранена</h4>
        {sale &&
          <div className=''>            
            <p className={rowClass}>Дата: {sale.date}</p>
            <p className={rowClass}>Клиент: {sale.client}</p>
            <p className={rowClass}>Объем: {sale.volume.toFixed(4)} м3</p>
            <p className={rowClass}>Вознаграждение продавца: {sale.seller_fee} рублей</p>
            {/* <p className={rowClass}>Вознаграждение грузчика: {sale.loader_fee} рублей</p> */}
            <p className={rowClass}>Стоимость доставки: {sale.delivery_fee} рублей</p>

            <p className='mb-1 font-17 font-500 color-black'>
              Сумма продажи: {sale.selling_total_cash.toFixed(1)}  рублей
            </p>

            <LumbersTable lumber_records={sale.lumber_records}/>
          </div>
        }
        {message &&
          <h2 className='color-green1-light text-center'>Данные сохранены!</h2> 
        }
      </div>
    </div>
  )
}

export function SaleCommonToCreate (props) {
  const { sale, saveData, back, sellers } = props
  const rowClass = 'mb-1 font-15 font-400 color-black'
  let seller = null
  if (sellers)
    seller = getObjectbyId(sellers, sale.seller)
  return (
    <div className='card card-style mt-2'>
      <div className='content'>
        <h4>Проверяем данные</h4>
        {sale &&
          <div className=''>
            <p className={rowClass}>Клиент: {sale.client}</p>
            <p className={rowClass}>Объем: {sale.volume.toFixed(4)} м3</p>
            <p className={rowClass}>Грузчик: {sale.loader ? 'да' : "нет"} </p>
            {/* <p className={rowClass}>Бонус складу: {sale.bonus_kladman ? 'да' : 'нет'}</p> */}
            <p className={rowClass}>Продавец: {seller ? seller.nickname : 'нет'}</p>
            <p className={rowClass}>Доставка: {sale.deliveryFee ? sale.deliveryFee + 'рублей' : 'нет'}</p>
            <p className='mb-1 font-17 font-500 color-black'>Сумма: {sale.sale_cash.toFixed(1)} рублей</p>
            <LumbersTable lumber_records={sale.raw_records}/>
          </div>
        }
        <div className='d-flex justify-content-around'>
          <button onClick={back}
            className='btn btn-s mr-2 text-uppercase font-900 bg-dark color-white rounded-sm shadow-l'>
            назад
          </button>
          <button onClick={saveData}
            className='btn btn-s text-uppercase font-900 bg-highlight rounded-sm shadow-l mt-2'>
              Рассчитать и сохранить данные
          </button>
        </div>
      </div>
    </div>
  )
}