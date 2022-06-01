import React, { } from 'react';

function FilteredLumberTr (props) {
  const { lumber, calcType, calcRowAndTotal, key } = props
  let tr = 
    <tr key={key}>
      <td>
        {lumber.full_name} 
        {lumber.wood_species === 'pine' 
          ? <span className='d-block color-brown1-light'>сосна</span> 
          : <span className='d-block color-green2-light'>лиственница</span>}
      </td>
      <td className='w-25'>
        <input style={{'color': '#6c6c6c'}}
          name='quantity'
          type='number' className='w-75' onChange={(e) => calcRowAndTotal(e, lumber)} 
          value={lumber.quantity > 0 && lumber.quantity}/>
      </td>
      <td>{lumber.volume_total > 0 && lumber.volume_total.toFixed(4) + ' м3'}</td>
      <td className='w-25'>
        <input style={{'color': '#6c6c6c'}}
          name='rate'
          type='number' className='w-100' onChange={(e) => calcRowAndTotal(e, lumber)} 
          value={lumber.employee_rate > 0 && lumber.employee_rate}/>
      </td>
      <td>{lumber.cash > 0 && lumber.cash.toFixed(0) + ' руб'}</td>
    </tr>
  
  if (calcType === 'mixed' ) {
    if ((lumber.lumber_type !== 'doska' & lumber.wood_species === 'larch') | ( lumber.wood_species === 'pine'))
      return tr
    }
  
  if (calcType === 'sorted' ) {
      return tr
    }
  return null
}

export function LumberTableMixed (props) {
  const { lumbers, calcRowAndTotal, totalVolume, totalCash, calcType } = props

  return (
    <table className='table table-sm table-responsive text-center' 
      style={{'lineHeight': '17px', 'color': '#6c6c6c'}}>
      <thead>
        <th>Изделие</th>
        <th>Кол-во</th>
        <th>Обьем</th>
        <th>Цена</th>
        <th>Сумма</th>
      </thead>
      <tbody>
      {lumbers.map((lumber, key) => 
        <FilteredLumberTr lumber={lumber} calcType={calcType} calcRowAndTotal={calcRowAndTotal} key={key}/>
        )}
        <tr>
          <td>Итого</td>
          <td className='w-25'>
            -
          </td>
          <td>
            <span className='font-17 font-600'>
              {totalVolume > 0 && totalVolume.toFixed(4) + ' м3'}
            </span>
          </td>
          <td>-</td>
          <td>
            <span className='font-17 font-600'>
              {totalCash > 0 && totalCash.toFixed(0) + ' руб'}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function LumberTable (props) {
  const { lumbers } = props
  return(
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
          цена за м3
        </th>
        <th>
          сумма
        </th>
      </thead>
      <tbody>
        {lumbers.map(lumber_record =>
        <tr>
          <td>
            {lumber_record.name ? lumber_record.name : lumber_record.lumber}
          </td>
          <td>{lumber_record.quantity} шт</td>
          <td>
            {lumber_record.volume_total 
              ? lumber_record.volume_total.toFixed(4) + 'м3' : lumber_record.volume.toFixed(4) + 'м3'}
          </td>
          <td>{lumber_record.rate || lumber_record.employee_rate} руб</td>
          <td>{(lumber_record.total_cash || lumber_record.cash).toFixed(0)} руб</td>
        </tr>
          )}
      </tbody>
    </table>
  )
}

export function ShiftToSave (props) {
  const { shift, saveData, back } = props
  const rowClass = 'mb-0 font-15 font-500 color-black'
  return (
    <div className='card card-style my-2'>
      <div className='content'>
      <h4>Проверяем данные</h4>
      {shift &&
        <div className=''>
          <p className={rowClass}>
            Объем общий: {shift.volume.toFixed(4)} м3</p>
          <p className={rowClass}>
            Общая сумма: {shift.employee_cash.toFixed(1)} рублей</p>
          <p className={rowClass}>Примечание: {shift.note}</p>

          <LumberTable lumbers={shift.raw_records}/>
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

export function CreatedShift (props) {
  const { shift, message } = props
  const rowClass = 'mb-0 font-15 font-500 color-black'
  return (
    <div className='card card-style my-2'>
      <div className='content'>
        <h4>Приход сохранен</h4>
        {shift &&
          <div className=''>
            <p className={rowClass}>Дата: {shift.date}</p>
            <p className={rowClass}>
              Объем общий: {shift.volume.toFixed(2)}  ({shift.back_calc_volume.toFixed(2)}) м3</p>
            <p className={rowClass}>
              Общая сумма: {shift.employee_cash && shift.employee_cash.toFixed(1)} ({shift.back_calc_cash.toFixed(1)}) 
              рублей</p>
            <p className={rowClass}>Примечание: {shift.note}</p>
            <LumberTable lumbers={shift.lumber_records}/>
          </div>
        }
        {message &&
          <h2 className='color-green1-light text-center'>Данные сохранены!</h2> 
        }
      </div>
    </div>
  )
}

export function EmployeesBlock (props) {
  const { totalCash, employees, activeEmployees, addEmployee } = props
  const empClass = ' rounded-xs px-2 py-2 '
  return (
    <div className='content'>
      <h4>Кто поставщик? {activeEmployees.length > 0 && '(' + activeEmployees.length + ')'}</h4>
      <div className='d-flex justify-content-between my-2 flex-wrap'>
        {employees.map(emp => 
          <div 
            className={activeEmployees.includes(emp) 
              ? 'bg-green2-light mx-1 my-1' + empClass : 'bg-dark1-dark mx-1 my-1' + empClass }
             onClick={() => addEmployee(emp)}>
            {emp.nickname}
          </div>
          )}
      </div>
      {activeEmployees.length > 0 && 
        <div>
          <div className='d-flex justify-content-start'>
            {activeEmployees.map(aEmp => 
              <div className='mx-2'>
                <span className='d-block font-16'>{aEmp.nickname}</span>
                {totalCash > 0 && 
                  <span className='font-17 font-600'> {(totalCash / activeEmployees.length).toFixed(0)} руб</span>
                }
              </div>
              )}
          </div>
        </div>
      }
    </div>
  )
}