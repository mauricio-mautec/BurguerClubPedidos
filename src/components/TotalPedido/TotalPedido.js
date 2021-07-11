import React, { Component } from 'react';
import classes from './TotalPedido.module.css';
import Button from '../UI/Button/Button';

class TotalPedido extends Component {

    valorTotal = 0.00;
    formTroco = null;

    state = {
        tipoPagamento: 'CARTÃO',
        trocoPara: '',
        showPagamento: false,
        showSumario: false,
        coletaTroco: false
    }

    tipoPagamentoHandler = (tipo) => {
        let novoTrocoPara = this.state.trocoPara;
        if (tipo === 'CARTÃO' || tipo === 'PIX' ) {
            novoTrocoPara = '';
        }
        this.setState( 
            { 
                tipoPagamento: tipo,
                coletaTroco: false,
                trocoPara: novoTrocoPara
            });
    }
    opcoesPagamentoToggle = ()=> {
        this.setState((prevState) => {
            return { showPagamento: !prevState.showPagamento }
        });
    }
    somaPedido = () => {
        return this.props.pedidos
                .map(item => {
                        return  item.modificador ?
                        item.modificador
                            .map( adicional => { return adicional.valor; })
                            .reduce((anterior, atual) => { return anterior + atual }, item.valor) : item.valor;})
                .reduce( (atual,novo) => {return atual + novo;}, 0);   
    }
    mostrarTrocoHandler = () => {
        if (this.state.tipoPagamento === 'CARTÃO' || this.state.tipoPagamento === 'PIX' || this.somaPedido() === 0.00) {
            if (this.somaPedido() === 0.00)   
                this.setState({ trocoPara: '' });
            return;
        }
        this.setState({ coletaTroco: true });
    }
    trocoChangeHandler = (event) => {
        this.setState( {trocoPara: event.target.value} );
    }
    trocoSubmitHandler = (event) => {
        let newTrocoPara = this.state.trocoPara;
        if (newTrocoPara <= this.somaPedido()) {
            newTrocoPara = '';
        }
        
        this.setState( 
            { coletaTroco: false,
              trocoPara: newTrocoPara
             });
        event.preventDefault();
    }

    confirmaPedido = () => {
        const totalPedido = this.somaPedido();
        let trocoPara = this.state.trocoPara ? parseFloat(this.state.trocoPara) : 0.00;
        let troco = trocoPara ? trocoPara - totalPedido : 0;
        troco = troco > 0 ? troco : 0;
        trocoPara = troco ? trocoPara : 0.00;
        const dadosPagamento = { 
                                    totalPedido: totalPedido,
                                    pagamento: this.state.tipoPagamento,
                                    trocoPara: trocoPara,
                                    troco: troco
                               };
        this.props.confima(dadosPagamento);
    }

    componentDidUpdate () {
        if (this.formTroco) {
            this.nameInput.focus();
        }
    }
    render () {
        this.valorTotal = this.somaPedido();
        const currentPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.valorTotal);
        
        let opcoesPagamento = null;
        if (this.state.showPagamento) {
            opcoesPagamento = ( 
                <div className={classes.TotalPedido}>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('PIX')}}>PIX</Button>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('CARTÃO')}}>CARTÃO</Button>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('DINHEIRO')}}>DINHEIRO</Button>
                   {this.state.tipoPagamento==='DINHEIRO'?<Button btnType="Alert" clicked={()=>this.mostrarTrocoHandler()}>TROCO</Button> : null}
                   <Button btnType="Success" clicked={this.confirmaPedido}>CONFIRMA_PEDIDO</Button>
               </div>
           ); 
        }
        
        this.formTroco = null;
        let textoFinal = '';
        
        if (this.valorTotal > 0) {
            textoFinal = `${this.state.tipoPagamento},`;
            if (this.state.coletaTroco) {
                this.formTroco = (
                    <div className={classes.TotalPedido}>
                    <form onSubmit={this.trocoSubmitHandler.bind(this)}>
                        <label>
                            TROCA PARA R$:
                            <input 
                                ref={(input) => {this.nameInput = input;}}
                                type="text" 
                                value={this.state.trocoPara} 
                                onChange={this.trocoChangeHandler.bind(this)} />
                        </label>
                    </form>
                    </div>
                ); 
            }
            if (this.state.tipoPagamento === 'DINHEIRO' && this.state.trocoPara > 0) {
                const valorTroco = this.state.trocoPara - this.valorTotal
                const troco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTroco);
                const pgmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.state.trocoPara);
                if (valorTroco > 0) textoFinal += ` TROCO (${pgmt}):  ${troco},`
            }
        } 

        textoFinal += ` TOTAL PEDIDO: ${currentPrice}`
        const trocoStyle = this.state.showPagamento ? {cursor: "zoom-out"} : {cursor: "zoom-in"};

        return (
            <>
            <div 
                className={classes.TotalPedido} 
                onClick={this.opcoesPagamentoToggle}>
                <span style={trocoStyle}>
                    <strong>{textoFinal}</strong>
                </span>
            </div>
            {opcoesPagamento}
            {this.formTroco}
            </>
        );
    }
}

export default TotalPedido;
