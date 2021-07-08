import React from 'react';
import Aux from '../../hoc/Auxiliar';
import SumarioPrint from './SumarioPrint/SumarioPrint';


const sumario = (props) => {
    
    const pedidos = props.pedidos;
    var elementos = [];

    pedidos.forEach((pedido,idx) => {
        const fmtPedidoValor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor);
        elementos.push([pedido.nome,fmtPedidoValor, 0]);
        
       if (pedido.modificador) {
           pedido.modificador.forEach( (altera) => {
               const val = altera.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(altera.valor) : null;
               let align = val ? 1 : 2;
               elementos.push([altera.nome, val, align]); });
        }
    });

    const descricao = elementos.map( (pedido, idx) => {
        let styl = [];
        switch (pedido[2]) {
            case 0:
                styl[0] = 'left'; 
                styl[1] = 'bold';
                break;
            case 1:  
                styl[0] = 'right'; 
                styl[1] = 'normal';
                break;
            default:
                styl[0] = 'center';
                styl[1] = 'normal';
        }
        return (<tr key={idx}><td style={{textAlign: styl[0], fontWeight: styl[1]}}>{pedido[0]}</td><td style={{textAlign: "right", fontWeight: styl[1]}}>{pedido[1]}</td></tr>);
    });

    let valorTotal = 0;

    valorTotal = props.formaPagamento ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.formaPagamento.totalPedido) : 0.0;
    let formaPagamento = '';
    if (props.formaPagamento) {
        formaPagamento = props.formaPagamento.pagamento;
        if (props.formaPagamento.pagamento === 'DINHEIRO' && props.formaPagamento.trocoPara > 0) {
            const troco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.formaPagamento.troco);
            const pgmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.formaPagamento.trocoPara);
            if (props.formaPagamento.troco > 0) formaPagamento += `, TROCO P/${pgmt}:  ${troco}`
        }
	if (formaPagamento === 'PIX') formaPagamento = 'PIX 40028107000162';
    }
    // const endereco = props.cliente.endereco ? props.cliente.endereco.replace(/(?:\r\n|\r|\n)/g, '<br>'):null;

    return (
        <Aux>
            <SumarioPrint 
                pedidoID={props.pedidoID}
                nome={props.cliente.nome}
                total={valorTotal}
                descricao={descricao}
                pagamento={formaPagamento}
                celular={props.cliente.celular}
                endereco={props.cliente.endereco}
                funcCancela={props.cancelaSumario}
                funcConfirma={props.confirmaPedido} />
        </Aux>
    );
}

// <div className={classes.Comando}>
//     <Button btnType="Danger" clicked={props.cancelaSumario}>FECHA</Button>
//     <Button btnType="Success" clicked={imprimeConfirma}>CONFIRMADO</Button>
// </div>
export default sumario;
