import React, { Component } from 'react';
import classes from './InfoCliente.module.css';
import Button from '../UI/Button/Button';

class InfoCliente extends Component {

    state = {
        nome: '',
        celular: '',
        endereco: ''
    }
    formInfo = null;
    
    fechaHandler = (event) => {
        this.props.cancelaInfoCliente();
        event.preventDefault();
    }

    formHandler = (event) => {
        const infoClient = { ...this.state };
        this.props.confirmaInfoCliente(infoClient);
        event.preventDefault();
    }

    formNomeChangeHandler = (event) => {
        const input = event.target.value;
        this.setState( { nome: input.toUpperCase() } );
    }
    
    formCelularChangeHandler = (event) => {
        this.setState( { celular: event.target.value } );
    }
    
    formEnderecoChangeHandler = (event) => {
        const input = event.target.value;
        this.setState( { endereco: input.toUpperCase() } );
    }
    componentDidMount () {
        if (this.formInfo) {
            this.nameInput.focus();
        }
    }
    render () {
        this.formInfo = (
            <div>
            <p>#{this.props.pedidoID}</p>
            <form onSubmit={this.formHandler.bind(this)}>
            <label>
                Cliente:
                <input className={classes.textInput} 
                    ref={(input) => {this.nameInput = input;}}
                    type="text" 
                    value={this.state.nome} 
                    onChange={this.formNomeChangeHandler.bind(this)} />
            </label>
            <label>
                Celular:
                <input className={classes.textInput} 
                    type="text" 
                    value={this.state.valor} 
                    onChange={this.formCelularChangeHandler.bind(this)}
                />
            </label>
            <label>
                Endereço:
                <textarea className={classes.textEndereco} 
                    type="text" 
                    value={this.state.endereco} 
                    onChange={this.formEnderecoChangeHandler.bind(this)}
                />
            </label>
            <Button btnType="Success" type="submit">GUARDA</Button>
            <Button btnType="Danger" clicked={this.fechaHandler}>FECHA</Button>
            </form>
        </div> 
        );
        return (
            <>
            {this.formInfo}
            </> );
        
    }
}

export default InfoCliente;