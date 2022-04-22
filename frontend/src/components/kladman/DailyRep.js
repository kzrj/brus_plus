import React, { } from 'react';

export function SalesList (props) {
  const { sales, sales_totals, sellers_fee } = props

  return (
    <div>
      <table className='table table-sm' style={{lineHeight: '17px'}}>
        <thead>
          <th>Сумма</th>
          <th>Продавец</th>
          <th>Клад/груз</th>
          <th>Доставка</th>
        </thead>
        <tbody>
          {sales.length > 0 && sales.map(sale =>
          <tr>
            <td>
              <span className='d-block'>{sale.client}</span>
              <span>{sale.selling_total_cash}</span>
            </td>
            <td>
              <span className='d-block'>{sale.seller_name}</span>
              <span>{sale.seller_fee}</span>
            </td>
            <td>
              <span className='d-block'>К {sale.kladman_fee}</span>
              <span>Г {sale.loader_fee}</span>
            </td>
            <td>
              <span>{sale.delivery_fee}</span>
            </td>
          </tr>
            )}
          {sales_totals && 
            <tr>
              <td className=''>
                <span className='d-block font-15 '>Итого доход</span>
                <span className='font-15 font-500 color-green2-light'>
                  +{sales_totals.total_selling_cash} р
                </span>
              </td>
              <td>
                {sellers_fee.length > 0 && sellers_fee.map(seller => seller.total > 0 &&
                  <span className='d-block'>{seller.name} {seller.total}</span>
                )}
              </td>
              <td>
                <span className='d-block'>К {sales_totals.total_kladman_fee}</span>
                <span>Г {sales_totals.total_loader_fee}</span>
              </td>
              <td>
                <span>{sales_totals.total_delivery_fee}</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}


export function CashRecordsList (props) {
  const { records } = props

  return (
    <div>
      <table className='table table-sm'>
        <thead>
          <th>Сумма</th>
          <th>Примечание</th>
        </thead>
        <tbody>
          {records.length > 0 && records.map(record =>
          <tr>
            {record.record_type == 'withdraw_employee' &&
              <td className='text-nowrap color-red1-light'>
                -{record.amount} р
              </td>
            }
            {record.record_type == 'rama_expenses' &&
              <td className='text-nowrap color-red1-light'>
                -{record.amount} р
              </td>
            }
            {record.record_type == 'sale_income' &&
              <td className='text-nowrap color-green1-light'>
                +{record.amount} р
              </td>
            }
            <td className='text-nowrap'>
              {record.note}
            </td>
          </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}
