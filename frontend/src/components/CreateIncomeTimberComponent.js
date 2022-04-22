import React, { Component } from 'react';


function FilteredTimberTr (props) {
  const { timber_record, calcType, calcRowAndTotal, key } = props
  let tr = 
    <tr>
      <td style={{lineHeight: '15px'}}>
        {timber_record.diameter }
        {timber_record.wood_species === 'Сосна' 
          ? <span className='font-12 font-italic color-green1-light d-block'>{timber_record.wood_species}</span>
          : <span className='font-12 font-italic color-brown1-light d-block'>{timber_record.wood_species}</span>
        }
      </td>
      <td className=''>
          <input style={{'color': '#6c6c6c'}}
            type='number' className='w-75' onChange={(e) => calcRowAndTotal(e, timber_record)} 
            value={timber_record.quantity > 0 && timber_record.quantity}/>
      </td>
      <td className=''>
        {timber_record.total_volume ? timber_record.total_volume.toFixed(4) : 0} m3
      </td>
    </tr>
  
  if (calcType === 'mixed' ) {
    if ((timber_record.wood_species === 'Лиственница') | ( timber_record.wood_species === 'Сосна'))
      return tr
    }
  
  if (calcType === 'pine' ) {
    if (timber_record.wood_species === 'Сосна')
      return tr
    }

  if (calcType === 'larch' ) {
    if (timber_record.wood_species === 'Лиственница')
      return tr
    }
  return null
}

export function TimberTable (props) {
  const { timbers, calcRowAndTotal, totalQnty, totalVolume, calcType } = props
  return(
    <table className='table table-sm mt-2'>
      <thead>
        <th>
          D
        </th>
        <th>
          кол-во
        </th>
        <th>
          объем
        </th>
      </thead>
      <tbody>
        {timbers.map((timber_record, key) =>
          <FilteredTimberTr timber_record={timber_record} calcRowAndTotal={calcRowAndTotal} 
            calcType={calcType} key={key}/>
          )}
        <tr>
          <td colSpan='2'>
            <span className='font-17'>Количество: {totalQnty}</span>
          </td>
          <td >
            <span className='font-17'>Объем: {totalVolume ? totalVolume.toFixed(5) : 0}</span>
          </td>

        </tr>
      </tbody>
    </table>
  )
}

export function TimberTableRead (props) {
  const { timbers } = props
  return(
    <table className='table table-sm mt-2'>
      <thead>
        <th>
          D
        </th>
        <th>
          кол-во
        </th>
        <th>
          объем
        </th>
      </thead>
      <tbody>
        {timbers.map((timber_record, key) => timber_record.quantity > 0 &&
          <tr>
            <td style={{lineHeight: '15px'}}>
              {timber_record.diameter}
              {timber_record.wood_species === 'Сосна' 
                ? <span className='font-12 font-italic color-green1-light d-block'>{timber_record.wood_species}</span>
                : <span className='font-12 font-italic color-brown1-light d-block'>{timber_record.wood_species}</span>
              }
            </td>
            <td>{timber_record.quantity} шт</td>
            <td>{timber_record.total_volume ? timber_record.total_volume.toFixed(5) : 0 } m3</td>
          </tr>
          )}
      </tbody>
    </table>
  )
}


export function IncomeToSave (props) {
  const { incomeTimber, saveData, back } = props
  const rowClass = 'mb-0 font-15 font-500 color-black'
  return (
    <div className='card card-style my-2'>
      <div className='content'>
      <h4>Проверяем данные</h4>
      {incomeTimber &&
          <div className=''>
            <p className={rowClass}>
              Общее количество: {incomeTimber.totalQnty} шт
            </p>
            <p className={rowClass}>
              Объем: {incomeTimber.totalVolume.toFixed(5)} m3
            </p>
            <TimberTableRead timbers={incomeTimber.raw_timber_records}/>
          </div>
        }
        <div className='d-flex justify-content-around'>
          <button onClick={back}
            className='btn btn-m text-uppercase font-900 bg-dark color-white rounded-sm shadow-l'>
            назад
          </button>
          <button onClick={saveData}
            className='btn btn-m text-uppercase font-900 bg-highlight rounded-sm shadow-l'>
              Сохранить данные
          </button>
        </div>
      </div>
    </div>
  )
}


export function CreatedIncome (props) {
  const { createdIncome, message } = props
  const rowClass = 'mb-0 font-15 font-500 color-black'
  return (
    <div className='card card-style my-2'>
      <div className='content'>
        <h4>Приход сохранен</h4>
        {createdIncome &&
          <div className=''>
            <p className={rowClass}>Дата: {createdIncome.created_at}</p>
            <p className={rowClass}>
              Общее количество: {createdIncome.quantity} шт</p>
            <p className={rowClass}>
              Общий объем: {createdIncome.volume} м3</p>              
            <p className={rowClass}>Примечание: {createdIncome.note}</p>

            <TimberTableRead timbers={createdIncome.timber_records}/>
          </div>
        }
        {message &&
          <h2 className='color-green1-light text-center'>Данные сохранены!</h2> 
        }
      </div>
    </div>
  )
}