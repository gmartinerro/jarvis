import React, {Component} from 'react';
import './SalesCalendar.scss';
import {connect} from 'react-redux';


class CustomerList extends Component {

    render() {
      return (
        <div className="CustomerList">
            <table>
                <thead>
                    <tr>
                        <td className='td-left'>Nombre</td>
                        <td>Días sin comprar</td>
                        <td>Pedidos</td>
                        <td>Ticket medio</td>
                        <td>Gasto total</td>
                        <td>Cluster</td>
                    </tr>
                </thead>
                <tbody>
                    {this.renderCustomersPage()}
                </tbody>
            </table>
        </div>
      );
    }

    renderCustomersPage(){

        if (!this.props.customerList)
            return null;

        const clusterTranslation=['FIDELIZAR','MUY OCASIONAL','HABITUAL','OCASIONAL/FID']

        const result = this.props.customerList.map(
            item => {
            return (
                <tr>
                    <td className='td-left'>{item[2]} {item[3]}</td>
                    <td>{item[5]}</td>
                    <td>{item[0]}</td>
                    <td>{item[11].toFixed(2)}</td>
                    <td>{item[1].toFixed(2)}</td>
                    <td>{clusterTranslation[item[13]]}</td>
                </tr>
            )}           
        );

        return result;
    }
  }

  const mapStateToProps = (state)=>{
      return {customerList: state.customerList}
  }

export default connect(mapStateToProps)(CustomerList);