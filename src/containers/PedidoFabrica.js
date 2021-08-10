import React, { Component } from 'react';
import Produto from '../components/Produto/Produto';
import Pedido from '../components/Pedido/Pedido';
import TotalPedido from '../components/TotalPedido/TotalPedido';
import Comando from '../components/Comando/Comando';
import axios from 'axios';
import classes from './PedidoFabrica.module.css';
import Aux from '../hoc/Auxiliar';
import Modal from '../components/UI/Modal/Modal';
import Sumario from '../components/Sumario/Sumario';
import InfoCliente from '../components/InfoCliente/InfoCliente';
import axiosConnect from '../axiosConnect';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../components/UI/Spinner/Spinner';
//const rabbit = require ('amqplib/callback_api');

const url="http://pedidos:3000";

class Layout extends Component {
    constructor (props) {
        super(props);
        let newDate = new Date();
        let mes  = `${newDate.getMonth()+1}`.padStart(2, '0');
        let dia  = `${newDate.getDate()+1}`.padStart(2, '0');
        let hora = `${newDate.getHours()}`.padStart(2, '0');
        let min  = `${newDate.getMinutes()}`.padStart(2, '0');
        let sec  = `${newDate.getSeconds()}`.padStart(2, '0');
        let pedidoID = `${newDate.getFullYear()}-${mes}-${dia} ${hora}:${min}:${sec}`;         

        this.state = {
            pedidoID: pedidoID,
            produtos: [],
            grupoProdutos: [],
            adicionais: [],
            grupoAdicionais: [],
            grupoVisual: [],
            pedidos:  [],
            cliente: {},
            produtoSelecionado: null,
            adicionalSelecionado: null,
            pedidoSelecionado: null,
            formaPagamento: null,
            showProdutos: true,
            showSumario: false,
            showInfoCliente: true,
            loading: false
        }
    }

    componentDidMount () {
        console.log('componentDidMount');
        console.log(url);
        document.title =  'CLIENTE';
        // axios.get("https://jsonplaceholder.typicode.com/posts")
        if (this.state.produtos.length === 0)
        axios.get(url+"/produtos/RelacaoProdutos.json", 
           { headers: {
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*'

           }})
            .then ( dados => {
                const produtos = dados.data;
                console.log(typeof(produtos));
                const updProdutos = produtos.map( (prod, idx) => {
                    return {
                        id: idx,
                        valor: prod.valor,
                        nome: prod.nome.toUpperCase(),
                        grupo: prod.grupo }}).sort((a,b) => a.nome > b.nome);
               
        // EXTRAI UMA RELACAO DOS GRUPOS DISPONIVEIS
                const grpProdutos = updProdutos
                    .map( prod => {return prod.grupo })
                    .filter((value, index, arr) => { return arr.indexOf(value) === index; })
                    .map(grupo => { return { grupo: grupo, mostra: false } })
                    .sort((a,b) => a.grupo > b.grupo );
                    
                this.setState( { produtos: updProdutos, grupoProdutos: grpProdutos} );
            })
            .catch (error => { console.log(error); });
        
        if (this.state.adicionais.length === 0)    
        axios.get(url + "/produtos/AdicionalProdutos.json", { 
           headers:
                {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Crentials': 'true'
                }
            })
            .then ( dados => {
                const adicionais = dados.data;
                const updAdicionais = adicionais.map( (prod, idx) => {
                    return {
                        id: idx,
                        valor: prod.valor,
                        nome: prod.nome.toUpperCase(),
                        grupo: prod.grupo
                    }
                }).sort((a,b) => a.nome > b.nome);
                
                const grpAdicionais = updAdicionais
                    .map (adicional => { return adicional.grupo })
                    .filter ((valor, indice, arr) => {return arr.indexOf(valor) === indice;})
                    .map( grupo => { return { grupo: grupo, mostra: false } })
            .sort((a,b) => a.grupo > b.grupo);
                
                this.setState( { adicionais: updAdicionais, grupoAdicionais: grpAdicionais } );
            })
            .catch (error => { console.log(error); });
        console.log('Connection to RabbitMQ....');

         //this.setState( { loading: true });
    } // componentDidMount

    encontraItem(prodID, local) {
        console.log('encontraItem');
        const itens = local;
        for (let key of itens.keys()) {
            if (itens[key].id === prodID) {
                return key;
            }
        };
        return -1;
    }

    produtoSelecionadoHandler = (prodID) => {
        console.log('produtoSelecionandoHandler');

        if (this.state.showProdutos) { // INSERÇÃO ITEM PRODUTO
            // encontrar objeto em produtos
            const key = this.encontraItem(prodID, this.state.produtos);
            if (key === -1) {
                return;
            }
            const item  = this.state.produtos[key];
            const novoItem = {
                ...item,
                uid: 0
            }
            // atualizar ou inserir item em
            var novoPedido = [ ...this.state.pedidos];
            novoPedido.push(novoItem);
            this.setState( {produtoSelecionado: prodID, pedidos: novoPedido} );
            const grupo = item.grupo;
            this.clrShowGrupo(grupo);

        }
        else { // INSERÇÃO DE ITEM ADICIONAL
            console.log('PRODUTO ADICIONAL PARA ', this.state.pedidoSelecionado);
            const adicional = { 
                nome: this.state.adicionais[prodID].nome,
                valor: parseFloat(this.state.adicionais[prodID].valor),
                alteraestoque: true
            };
            this.adicionaModificadorHandler (this.state.pedidoSelecionado, adicional);
           // this.clrShowGrupo(grupo);
        }
    }
    selecionaPedidoHandler = (pedido) => {
        console.log('selecionaPedidoHandler', pedido);
        this.setState( {pedidoSelecionado: pedido });
    }
    adicionaModificadorHandler = (pedidoIDX, adicional) => {
        console.log('adicionaModificadorHandler', adicional);

        const updPedidos = [ ...this.state.pedidos ];
        let updModificador = [];
        if (updPedidos[pedidoIDX].modificador) {
            updModificador = [ ...updPedidos[pedidoIDX].modificador, adicional ]; }
        else {
            updModificador = [ adicional ];
        }
        const pedido = { 
            ...updPedidos[pedidoIDX],
            modificador: updModificador
        }
        updPedidos[pedidoIDX] = pedido;

        this.setState( { pedidoSelecionado: pedidoIDX, pedidos: updPedidos } );
        console.log('adicionaModificadorHandler:', updPedidos);
    }
    removeModificadorHandler = (pedidoIDX, idx) => {
        console.log('removeModificadorHandler');
        const updPedidos = [ ...this.state.pedidos ];
        let updModificador = updPedidos[pedidoIDX].modificador;
        console.log('antes',updModificador);
        updModificador.splice(idx, 1);
        console.log('depois',updModificador);

        const pedido = { 
            ...updPedidos[pedidoIDX],
            modificador: updModificador
        }
        updPedidos[pedidoIDX] = pedido;

        this.setState( { pedidoSelecionado: pedidoIDX, pedidos: updPedidos } );
        console.log('Remocao de modificador:', pedidoIDX, idx);
    }
    pedidoRemoveHandler = (pedidoIDX) => {
        console.log('pedidoRemoveHandler');
        const arrayPedido = this.state.pedidos;
        arrayPedido.splice (pedidoIDX, 1);
        this.setState( { 
            pedidos: arrayPedido,
        showProdutos: true,
            formaPagamento: null
        });
    }
    // ATUALIZA FORMA DE PAGAMENTO E APRESENTA SUMARIO DA VENDA
    atualizaPagamentoHandler = (formaPagamento) => { 
        console.log('atualizaPagamentoHandler');
        let novoShowSumario= false;
        if (typeof (this.state.cliente.nome)    !== 'undefined' && 
            typeof (this.state.cliente.celular) !== 'undefined' &&
            this.state.cliente.nome.length  > 0 && 
            this.state.cliente.celular.length > 0 )
        {
            novoShowSumario = true;
        }
        else {
            alert('INFORME NOME / CELULAR CLIENTE');
        }

        this.setState( {
             formaPagamento: formaPagamento,
             showSumario: novoShowSumario });
    }
    cancelaInfoClienteHandler = () => {
        console.log('cancelaInfoClienteHandler');
        this.setState ( {
            showInfoCliente: false,
            cliente: '',
            celular: '',
            endereco: ''
        });
    }
    showInfoClienteHandler = ()=> {
        console.log('showInfoClienteHandler');
        this.setState( { showInfoCliente: true });
    }
    confirmaInfoClienteHandler = (dadosCliente) => {
        console.log('confirmaInfoClienteHandler');
        this.setState( 
            { 
                showInfoCliente: false,
                cliente: dadosCliente
            });
        document.title = dadosCliente.nome !== '' ? dadosCliente.nome : document.title;
    }
    cancelaSumarioHandler = () => {
        console.log('cancelaSumarioHandler');
        this.setState( {
            formaPagamento: null,
            showSumario: false
        })        
    }

    confirmaPedidoHandler = () => {
        console.log('confirmaPedidoHandler');
    
    //    this.setState( { loading: true });
        const dadosPedido = { 
            pedidoID: this.state.pedidoID,
            cliente: this.state.cliente,
            pedidos: this.state.pedidos,
            pagamento: this.state.formaPagamento
        }
    
        this.setState( { showSumario: false } );
        console.log ('Dados do Pedido:', dadosPedido);
/*
        const firebaseDB = `${this.state.pedidoID.substring(0,10)}.json`;
        axiosConnect.post(firebaseDB, dadosPedido)
            .then (response => {
                this.setState( { loading: false } )


            })
            .catch ( error => {
                this.setState( { loading: false });
                console.log (error);
            })
*/            
    }
    
    toggleShowProdutosHandler = () => {
        console.log('toggleShowProdutosHandler');
        this.setState ((prevState) => {
            console.log('toggleShowProdutosHandler', prevState.showProdutos)
            return { showProdutos: !prevState.showProdutos }
        });  
    }

    getProdutos = () => {
        var produtos = this.state.showProdutos ? [ ...this.state.produtos ] : [ ...this.state.adicionais ];
        var grupos   = this.state.showProdutos ? [ ...this.state.grupoProdutos ] : [ ...this.state.grupoAdicionais ];
        var selecao = [];
        var id = 100;

        for (const idx in grupos) {
            let grupo = grupos[idx].grupo;

            if (grupos[idx].mostra) {
                let sel = produtos.filter((prd)=> { return prd.grupo === grupo });
                selecao = selecao.concat(sel);
            }
            else {
                selecao = selecao.concat( { id: id, valor: 0.0, nome:grupo, grupo:grupo } );
                id = id + 1;
            }
        }
        return selecao;
    }

    clrShowGrupo = (grupo) => {
        console.log("clrShowGrupo", grupo);
        const grupos   = this.state.showProdutos ? this.state.grupoProdutos : this.state.grupoAdicionais;
        const idx = grupos.findIndex( (item) => { return item.grupo === grupo } );
        grupos[idx].mostra = false;
        if (this.state.showProdutos)
            this.setState( { grupoProdutos: grupos } );
        else
            this.setState( { grupoAdicionais: grupos } );
    }

    setShowGrupo = (grupo) => {
        console.log('setShowGrupo', grupo);
        const grupos   = this.state.showProdutos ? this.state.grupoProdutos : this.state.grupoAdicionais;
        const idx = grupos.findIndex( (item) => { return item.grupo === grupo } );
        grupos[idx].mostra = true;
        if (this.state.showProdutos)
            this.setState( { grupoProdutos: grupos } );
        else
            this.setState( { grupoAdicionais: grupos } );
    }

    getEntrega = () => {
        // CONSULTAR O VALOR DA ENTREGA COM BASE EM INFORMAÇÕES DO CLIENTE
        let entrega = 0.0;
        return entrega;
    }

    setEntrega = (entregaValor) => {
        const novoValorEntrega = entregaValor;
        // ATUALIZAR O VALOR DA ENTREGA COM BASE EM INFORMAÇÕES DO OPERADOR
        console.log(`SOLICITADO FRETE DE ${novoValorEntrega}`);
    }

    render () {
        console.log('rendering....');
        var produtos = [];
        if (this.state.produtos.length > 0 && this.state.adicionais.length > 0) {
            console.log(this.state.produtos.length, this.state.adicionais.length);
            const itens  = this.getProdutos();
            produtos = itens.map( item => {
                let func;
                if (item.nome === item.grupo) {
                    func = () => this.setShowGrupo(item.grupo);
                }
                else {
                    func = () => this.produtoSelecionadoHandler(item.id);
                }
    
                return (
                    <Produto 
                        key = {item.id}
                        nome = {item.nome}
                        valor = {item.valor}
                        grupo = {item.grupo}
                        clicked = {func}
                    />
                )
            });
        }

        const pedidos = this.state.pedidos.map((item, idx) => {
            return (
                <Pedido
                    id = {item.id}
                    idx = {idx}
                    key = {idx}
                    nome = {item.nome}
                    valor = {item.valor}
                    grupo = {item.grupo}
                    modificador = {item.modificador}
                    adicionaModificador = {this.adicionaModificadorHandler}
                    removeModificador = {this.removeModificadorHandler}
                    removePedido = {() => this.pedidoRemoveHandler(idx)}
                    toggleShowProdutos = {this.toggleShowProdutosHandler}
                    showProdutos = {this.state.showProdutos}
                    selecionaPedido = {this.selecionaPedidoHandler}
                    pedidoSelecionado = {this.state.pedidoSelecionado}
                />
            );
        });

        let sumarioPedido = <Spinner />;
        if (! this.state.loading) {
            sumarioPedido = 
                <Sumario
                    pedidoID       = {this.state.pedidoID}
                    pedidos        = {this.state.pedidos}
                    formaPagamento = {this.state.formaPagamento}
                    cliente        = {this.state.cliente}
                    confirmaPedido = {this.confirmaPedidoHandler}
                    cancelaSumario = {this.cancelaSumarioHandler} />;
        }

        let relacaoProdutos = this.state.produtos.length === 0 ? <Spinner /> : produtos;

        return (
            <Aux>
                <Modal
                    show={this.state.showInfoCliente}
                    fechaModal={this.cancelaInfoClienteHandler}>
                    <InfoCliente
                        pedidoID={this.state.pedidoID}
                        cliente={this.state.cliente}
                        cancelaInfoCliente={this.cancelaInfoClienteHandler}
                        confirmaInfoCliente={this.confirmaInfoClienteHandler}/>       
                </Modal>
                <Modal
                    show={this.state.showSumario}
                    fechaModal={this.cancelaSumarioHandler}>
                    {sumarioPedido}
                </Modal>
                <div id="container">
                   <div id="ColunaA">
                        <section>
                           <Comando
                            // pedidoID={this.state.pedidoID} 
                            // pedido={this.state.pedidos}
                            // pagamento={this.state.formaPagamento}
                            cliente = {document.title}
                            showInfoCliente={this.showInfoClienteHandler} />
                        </section>
                        <section>
                            <TotalPedido 
                            atualizaPagamento={this.atualizaPagamentoHandler}
                            getEntrega={this.getEntrega}
                            setEntrega={this.setEntrega}
                            pedidos={this.state.pedidos}/>
                        </section>
                        <section className={classes.Produtos}>
                        {relacaoProdutos}
                        </section>
                    </div>
                    <div id="ColunaB">
                        <section className={classes.Pedidos}>
                        {pedidos}
                        </section>
    
                    </div>
                </div>
            </Aux>
     );
    }
}

export default withErrorHandler(Layout, axiosConnect);
