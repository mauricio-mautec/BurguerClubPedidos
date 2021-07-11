import React, { Component, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import classes from './SumarioPrint.module.css';
import Button from '../../UI/Button/Button';
import Aux from '../../../hoc/Auxiliar';

class ComponentToPrint extends Component {

  render() {
    return (
          <Aux ref={this.wrapper}>
              <p>#{this.props.pedidoID}</p>
              <h2>Burguer Club</h2>
              <p>{this.props.nome}, confira seu pedido:</p>
              <table style={{ width: "100%" }}>
                <tbody>
                  {this.props.descricao}
                </tbody>
              </table>
              <table style={{ width: "100%" }}>
                <tbody>
                <tr>
                  <td style={{ textAlign: "right", "fontWeight": "bold" }}>
                    VALOR PEDIDO:
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      textDecoration: "overline",
                      "fontWeight": "bold"
                    }}
                    >
                    {this.props.total}
                  </td>
                </tr>
                </tbody>
              </table>
              <hr />
              <p style={{ "fontWeight": "bold" }}>Pagamento:</p>
              <p>{this.props.pagamento}</p>
              <hr />
                  <p style={{ "fontWeight": "bold" }}>Entrega: ({this.props.contato})</p>
              <address className={classes.Address}>
                {this.props.entrega}
              </address>
          </Aux>

    )
  }
}
const SumarioPrint = (props) => {
  const componentRef = useRef();
  const handlePrint  = useReactToPrint({content: () => componentRef.current,});
  const imprimeConfirma = () => {
        props.funcConfirma();
        handlePrint();
  }
  return (
    <div>
      <div ref={componentRef}>
      <ComponentToPrint 
          pedidoID={props.pedidoID}
          nome={props.nome}
          itens={props.descricao}
          pagamento={props.pagamento}
          contato={props.celular}
          entrega={props.endereco}
          descricao={props.descricao}
          total={props.total} />
          {/* ref={componentRef} /> */}
      </div>
      <div className={classes.Comando}>
      <Button btnType="Danger" clicked={props.funcCancela}>FECHA</Button>
      <Button btnType="Success" clicked={imprimeConfirma}>CONFIRMA</Button>
      </div>
    </div>
  )
}
// <div className={classes.Comando}>
//     <Button btnType="Danger" clicked={props.cancelaSumario}>FECHA</Button>
//     <Button btnType="Success" clicked={imprimeConfirma}>CONFIRMADO</Button>
// </div>
export default SumarioPrint;
