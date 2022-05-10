import React, { } from 'react';


function ShiftLumberTr (props) {
  const { record } = props
  const measureClass = 'font-10'
  return (
    <tr>
      <td style={{lineHeight: '15px'}}>
        {record.wood_species === 'larch'  
          ? <span className='d-block color-brown1-light'>листв</span>
          : <span className='d-block color-green1-light'>сосна</span>
        }
        {record.lumber.includes('доска') 
          ? <span className='font-italic'>{record.lumber}</span>
          : <span className=''>{record.lumber}</span>
        }
      </td>
      <td>
        {record.quantity}
        <span className={measureClass}> шт</span>
      </td>
      <td>{record.volume}<span className={measureClass}> м3</span></td>
      <td>{record.rate}<span className={measureClass}> р</span></td>
      <td>{record.total_cash}<span className={measureClass}> р</span></td>
    </tr>
  )
}

export function ShiftComponent (props) {
  const { shift, user, deleteShift } = props
  return (
    <div className='card card-style'>
      <div className='content mb-1'>
        <div className='d-flex justify-content-between'>
          <p className='color-black mb-0 font-16'>Дата: {shift.date} {shift.shift_type}</p>
          {user.is_manager && 
            <button className='btn btn-s bg-red1-light mr-2 text-uppercase' 
            onClick={() => deleteShift(shift.id)}>
              удалить</button>
          }
        </div>
        <p className='color-black mb-0 font-13 d-flex justify-content-between' style={{lineHeight: '15px'}}>
          <span>
            <span className='d-block mb-1'>Объем: <span className='d-block font-600 font-14'>{shift.volume} m3</span></span>
            <span>Объем без заборки: <span className='d-block font-600 font-14'>{shift.volume_without_zabor} m3</span></span>
          </span>
          <span>Общая сумма: <span className='d-block font-600 font-14'>{shift.back_calc_cash} р</span></span>
        </p>
      </div>
      <div className='content mt-0'>
        <table className='table table-sm'>
          <thead>
            <th>Пиломат</th>
            <th>кол-во</th>
            <th>объем</th>
            <th>цена</th>
            <th>сумма</th>
          </thead>
          <tbody>
            {shift.lumber_records.map(record => 
              <ShiftLumberTr record={record}/>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ShiftList (props) {
  const { shiftList, user, deleteShift } = props
  return (
    <div className='mt-2'>
      <h4 className='my-3 text-center'>Смены  ({shiftList.length})</h4>
      {shiftList.length > 0 && shiftList.map(shift => 
          <ShiftComponent shift={shift} user={user} deleteShift={deleteShift}/>
      )}
    </div>
  )
}