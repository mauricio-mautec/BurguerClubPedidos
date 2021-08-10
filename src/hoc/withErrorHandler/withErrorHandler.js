import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliar';

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null
        }
 
        componentDidMount () {
            axios.interceptors.request.use ( req => {
                this.setState( { error: null }); // limpa o erro a cada request
                return req; // retorna para dar prosseguimento ao request
            });
            axios.interceptors.response.use ( 
                res => res, // retorna a resposta
                error => {  this.setState ( { error: error }); } // guarda msg erro
            );
        }
 
        errorConfirmedHandler = () => {
            this.setState( { error: null }); // após confirmado limpa a msg erro
        }

        render () {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        fechaModal={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            )
        }
    }
}

export default withErrorHandler;