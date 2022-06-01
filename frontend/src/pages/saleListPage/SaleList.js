import React, { Component } from 'react';
import { connect } from 'react-redux';

import endpoints from '../../redux/api/saleListPageApi';
import { jsDateTimeToStrDate } from '../../components/utils';
import { DateFilter } from '../../components/CommonForms';

const saleListApi = endpoints.create();

export function SalesTable (props) {
  const { sales, totals, deleteSale, shop } = props

  return (
    <table className='table table-sm table-responsive'>
      <thead>
        <th>Дата/Клиент</th>
        <th>Пиломат</th>
        <th>Сумма/Объем</th>
        <th style={{lineHeight: '13px'}}>
        {shop.sale_type === 'seller_kladman_same' 
          ? 'Продавeц (комиссия кладмэна из вознаграждения продавца)'
          : 'Продавeц'
        }
        </th>
        <th>Доставка</th>
        <th className='text-nowrap'>Удалить</th>
      </thead>
      <tbody>
        {sales.map(sale => 
          <tr>
            <td style={{lineHeight: '15px'}}>
              {sale.date}
              <span className='d-block'>{sale.note}</span>
              <span className='font-13'>{sale.sale_type}</span>
            </td>
            <td className='text-nowrap'>
              {sale.lumber_records.map(lumber =>
                <span className='d-block mb-2' style={{lineHeight: '14px'}}>
                  {lumber.quantity}шт {lumber.lumber}
                  <span className='d-block font-italic'>{lumber.wood_species}</span>
                  <span className='d-block font-italic'>розница общ <span className='font-500'>
                    {lumber.selling_total_cash}</span></span>
                  <span className='d-block font-italic'>розница 1м3 <span className='font-500'>
                    {lumber.selling_price}</span></span>
                  <span className='d-block font-italic'>опт общ <span className='font-500'>
                    {lumber.shop_total_cash}</span></span>
                  <span className='d-block font-italic'>опт 1м3 <span className='font-500'>
                    {lumber.shop_price}</span></span>
                </span>
                )}
            </td>
            <td >
              <span>{sale.selling_total_cash}р</span>
              <span className='d-block'>{sale.volume} м3</span>
            </td>
            <td style={{lineHeight: '15px'}}>
              {shop.sale_type === 'seller_kladman_same' 
                ? <span className='d-block'>
                    <span className='d-block'>{sale.seller_fee - sale.kladman_fee}</span>
                    {`(${sale.seller_fee}  - ${sale.kladman_fee})`}
                  </span>
                : <span className='d-block'>{sale.seller_fee}</span>
              }
              {sale.seller_name && <span className=''>{sale.seller_name}</span>}
            </td>
            <td>
              {sale.delivery_fee}
            </td>
            <td>
              <button className='btn btn-xs bg-red1-light' value={sale.id} onClick={deleteSale}>Удалить</button>
            </td>
          </tr>
        )}
        <tr className='font-500 font-16'>
          <td>Итого</td>
          <td>-</td>
          <td>{totals.total_selling_cash}</td>
          <td>
            {shop.sale_type === 'seller_kladman_same' 
             ? <span>
                  <span className='d-block'>{totals.total_seller_fee - totals.total_kladman_fee}</span>
                  {`(${totals.total_seller_fee}  - ${totals.total_kladman_fee})`}
               </span>
             : totals.total_seller_fee
            }
          </td>

          <td>{totals.total_delivery_fee}</td>
          <td>{totals.total_add_expenses}</td>
        </tr>
      </tbody>
    </table>
  )
}


export class SaleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saleList: [],
      totals: {},

      startDate: '',
      endDate: '',
      
      message: null,
      error: null,
    }

  }

  componentDidMount() {
    let today = new Date()
    let yesterday = new Date()
    let startDate = jsDateTimeToStrDate(yesterday)
    let endDate = jsDateTimeToStrDate(today)

    saleListApi.getSaleList({shop: this.props.shopToSee.id, 
      date_before: endDate, date_after:startDate})
    .then(data => {
      this.setState({ ...this.state, saleList: data.sales, totals: data.totals,
        startDate: startDate, endDate: endDate });
    })
  }

  deleteSale = (e) => {
    saleListApi.deleteSale(e.target.value)
    .then(data => {
      this.setState({ ...this.state, saleList: data.sales, totals: data.totals });
    })
  }

  setData = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

  showResults = () => {
    saleListApi.getSaleList({shop: this.props.shopToSee.id, date_before: this.state.endDate,
       date_after: this.state.startDate})
    .then(data => {
      this.setState({ ...this.state, saleList: data.sales, totals: data.totals });
    })
  }

  render() {
    const { saleList, totals } = this.state
    return (
      <div className='mt-2'>
        <div className='card card-style mt-2'>
          <div className='content'>
            <DateFilter startDate={this.state.startDate} endDate={this.state.endDate} setData={this.setData}
              showResults={this.showResults}/>
          </div>
        </div>
        <div className='card card-style mb-2'>
          <div className='content'>
            <h4 className='mb-2'>Продажи ({saleList.length})</h4>
            {saleList.length > 0 
              ? <SalesTable sales={saleList} totals={totals} deleteSale={this.deleteSale}
                  shop={this.props.shopToSee} />
              : <h5>Нет продаж</h5>
            }
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
  shopToSee: state.auth.shopToSee,
  state: state
});


const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleList);