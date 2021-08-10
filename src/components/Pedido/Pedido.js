import React, { Component } from 'react';
import classes from './Pedido.module.css';
import Button from '../UI/Button/Button';

class Pedido extends Component {
    
    state = {
        nome: '',
        alteraestoque: false,
        valor: 0.00,
        showModifica: false
    }
    formModifica = null;

    toggleShowModifica = () => {
        this.props.selecionaPedido(this.props.idx);
        this.setState ((prevState) => {
            return { showModifica: !prevState.showModifica }
        })
    }
    adicionaModificadorHandler = (event) => {
        const context = { 
            nome: this.state.nome,
            valor: parseFloat(this.state.valor),
            alteraestoque: this.state.alteraestoque
        };

        
        this.setState(prevState => {
            return {
                nome: '',
                alteraestoque: false,
                valor: 0.00,
                showModifica: prevState.showModifica
                }    
        });
        this.props.adicionaModificador(this.props.idx, context);
        this.nameInput.focus();
        event.preventDefault();
    }
    removeModificadorHandler = (idx) => {
        this.props.removeModificador(this.props.idx, idx);
    }

    formNomeChangeHandler = (event) => {
        const input = event.target.value;

        this.setState( { nome: input.toUpperCase() } );
    }
    formValorChangeHandler = (event) => {
        this.setState( { valor: event.target.value } );
    }

    componentDidUpdate () {
        if (this.formModifica && this.nameInput.value === '') {
            this.nameInput.focus();
        }
    }
    showItens = (event) => {
        event.preventDefault();
        this.props.toggleShowProdutos();
        //alert('VOCE CLICOU NO BOTAO');
    }
    render () {
        let valorTotal = 0.00;
        valorTotal = this.props.modificador ? 
                this.props.modificador
                        .map( adicional => { return adicional.valor; })
                        .reduce((anterior, atual) => { return anterior + atual }, this.props.valor) : this.props.valor;
        
        const currentID = this.props.id;
        const DDs = this.props.modificador ? 
            this.props.modificador
                .map ( (item, idx) => {
                    const id =  `${currentID}${idx}`;
                    const valor = item.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor) : null;
                    return (
                        <dd 
                            key={id} 
                            className={classes.DD} 
                            onClick={() => this.removeModificadorHandler(idx)}>
                            {item.nome}&nbsp;&nbsp;<em>{valor}</em>
                        </dd>) }
                    ) : null;
            
        const total = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal);
        const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.props.valor);
        
        const lblToggle = this.props.showProdutos ? 'Adicionais' : 'Produtos';

        this.formModifica = this.state.showModifica ? (
                <div>
                    <form onSubmit={this.adicionaModificadorHandler.bind(this)}>
                    <label>
                        Alteração:
                        <input className={classes.textinputNome} 
                            ref={(input) => {this.nameInput = input;}}
                            type="text" 
                            value={this.state.nome} 
                            onChange={this.formNomeChangeHandler.bind(this)} />
                    </label>
                    <label>
                        Valor:
                        <input className={classes.textinputValor} 
                            type="text" 
                            value={this.state.valor} 
                            onChange={this.formValorChangeHandler.bind(this)}
                        />
                    </label>
                    <Button btnType= "Alert" type="submit">+</Button>
                    <Button btnType= "Alert" type="button" clicked={this.showItens}>{lblToggle}</Button>
                    </form>
                </div> ) : null;
        const dtClass = this.state.showModifica ? 'DTopen' : 'DTclose';
        const dtClass2 = this.props.pedidoSelecionado === this.props.idx ? 'DTSelecionado' : 'DTNormal';

        return (
            <dl className={classes.Pedido} key={this.props.id}>
                <dt id="label_id" className={[classes[dtClass], classes[dtClass2]].join(' ')} onClick={this.toggleShowModifica}>{this.props.nome}, {valor}</dt>
                {this.formModifica}
                {DDs}
                <dt id="total" style={{textAlign: "right"}}><em>{total}</em></dt>
                <button className={classes.Button} onClick={this.props.removePedido}>X</button>
            </dl>
        );
    }
}
    
  
export default Pedido;