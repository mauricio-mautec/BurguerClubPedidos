import React, { Component } from 'react';
import classes from './TotalPedido.module.css';
import Button from '../UI/Button/Button';

class TotalPedido extends Component {

    valorTotal = 0.00;
    valorPedido = 0.00;
    formTroco = null;
    formFrete = null;

    state = {
        tipoPagamento: 'CARTÃO',
        trocoPara: '',
        freteValor: this.props.getEntrega(),
        showPagamento: false,
        showSumario: false,
        coletaTroco: false,
        coletaFrete: false
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
    somaPedido = (valorInicial) => {
        return this.props.pedidos
                .map(item => {
                        return  item.modificador ?
                        item.modificador
                            .map( adicional => { return adicional.valor; })
                            .reduce((anterior, atual) => { return anterior + atual }, item.valor) : item.valor;})
                .reduce( (atual,novo) => {return atual + novo;}, valorInicial);   
    }
    mostrarTrocoHandler = () => {
        if (this.state.tipoPagamento === 'CARTÃO' || this.state.tipoPagamento === 'PIX' || this.somaPedido(0) === 0.00) {
            if (this.somaPedido(0) === 0.00)   
                this.setState({ trocoPara: '' });
            return;
        }
        this.setState({ coletaTroco: true });
    }
    mostrarFreteHandler = () => {
        this.setState({ coletaFrete: true });
    }

    trocoChangeHandler = (event) => {
        this.setState( {trocoPara: event.target.value} );
    }
    trocoSubmitHandler = (event) => {
        let newTrocoPara = this.state.trocoPara;
        if (newTrocoPara <= this.somaPedido(0)) {
            newTrocoPara = '';
        }
        
        this.setState( 
            { coletaTroco: false,
              trocoPara: newTrocoPara
             });
        event.preventDefault();
    }
    freteSubmitHandler = (event) => {
        this.setState( {coletaFrete: false} );
        this.props.setEntrega(this.state.freteValor);
        event.preventDefault();

    }
    freteChangeHandler = (event) => {
        let novoFreteValor = 1.0 * event.target.value >= 0 ? event.target.value * 1.0 : 0.0;
        console.log(novoFreteValor);
        this.setState( {freteValor: novoFreteValor} ); 
    }
    confirmaPedido = () => {
        const totalPedido = this.somaPedido(this.state.freteValor);
        let trocoPara = this.state.trocoPara ? parseFloat(this.state.trocoPara) : 0.00;
        let troco = trocoPara ? trocoPara - totalPedido : 0;
        troco = troco > 0 ? troco : 0;
        trocoPara = troco ? trocoPara : 0.00;
        const formaPagamento = { 
                                    totalPedido: totalPedido,
                                    pagamento: this.state.tipoPagamento,
                                    trocoPara: trocoPara,
                                    troco: troco,
                                    frete: this.state.freteValor
                               };
        this.props.atualizaPagamento(formaPagamento);
    }

    componentDidUpdate () {
        if (this.formTroco) {
            this.nameInput.focus();
        }
        if (this.formFrete) {
            this.nameInput.focus();
        }
    }
    render () {
        this.valorPedido = this.somaPedido(0);
        this.valorTotal  = this.valorPedido + this.state.freteValor;
        let strFormaPagamento  = `${this.state.tipoPagamento}: ` + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.valorTotal);
        let strValorTroco      = '';
        let strTotalPedido     = 'TOTAL: '  + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.valorTotal);
        let strValorFrete      = 'FRETE: '  + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.state.freteValor);
        let strValorPedido     = 'PEDIDO:' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.valorPedido);

        let opcoesPagamento = null;
    
        if (this.state.showPagamento) {
            opcoesPagamento = ( 
                <div className={classes.TotalPedido}>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('PIX')}}>PIX</Button>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('CARTÃO')}}>CARTÃO</Button>
                   <Button btnType="Success" clicked={()=>{this.tipoPagamentoHandler('DINHEIRO')}}>DINHEIRO</Button>
                   <Button btnType="Success" clicked={()=>{this.mostrarFreteHandler('FRETE')}}>FRETE</Button>
                   {this.state.tipoPagamento==='DINHEIRO'?<Button btnType="Alert" clicked={()=>this.mostrarTrocoHandler()}>TROCO</Button> : null}
                   <Button btnType="Success" clicked={this.confirmaPedido}>CONFIRMA_PEDIDO</Button>
               </div>
           ); 
        }
        
        this.formTroco = null;
        this.formFrete = null;
        
        // FORM FRETE E TROCO
        if (this.valorPedido > 0 ) {
            if (this.state.coletaFrete) {
                this.formFrete = (
                    <div className={classes.TotalPedido}>
                    <form onSubmit={this.freteSubmitHandler.bind(this)}>
                        <label>
                            ENTREGA R$:
                            <input 
                                ref={(input) => {this.nameInput = input;}}
                                type="text" 
                                value={this.state.entrega} 
                                onChange={this.freteChangeHandler.bind(this)} />
                        </label>
                    </form>
                    </div>
                );
            }
            if (this.state.coletaTroco) {
                this.formTroco = (
                    <div className={classes.TotalPedido}>
                    <form onSubmit={this.trocoSubmitHandler.bind(this)}>
                        <label>
                            TROCO PARA R$:
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
                if (valorTroco > 0) {
                    strFormaPagamento = `DINHEIRO: ${pgmt}`;
                    strValorTroco     = `TROCO:  ${troco}`;
                }
            }
        } 
        const trocoStyle = this.state.showPagamento ? {cursor: "zoom-out"} : {cursor: "zoom-in"};

        return (
            <>
            <div 
                className={classes.TotalPedido} 
                onClick={this.opcoesPagamentoToggle}>
                <span style={trocoStyle}><p><strong>{strValorPedido}</strong></p></span>
                <span style={trocoStyle}><p><strong>{strValorFrete}</strong></p></span>
                <span style={trocoStyle}><p><strong>{strTotalPedido}</strong></p></span>
                <hr/>
                <span style={trocoStyle}><p><strong>{strFormaPagamento}</strong></p></span>
                <span style={trocoStyle}><p><strong>{strValorTroco}</strong></p></span>
            </div>
            {opcoesPagamento}
            {this.formTroco}
            {this.formFrete}
            </>
        );
    }
}

export default TotalPedido;
