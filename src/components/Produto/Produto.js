import React from 'react';
import classes from './Produto.module.css';

const produto = (props) => {
    const estilo = props.grupo;
    if (props.nome === props.grupo) {
        return (
            <table className={[classes.Produto, classes[estilo], classes['GRUPO']].join(' ')} onClick={props.clicked} key={props.id}>
                    <tbody>
                        <tr><td>{props.nome}</td></tr>
                    </tbody>
            </table>
     );
    }
    else {
        const valorReal =new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.valor); 
        return (
            <table className={[classes.Produto, classes[estilo]].join(' ')} onClick={props.clicked} key={props.id}>
                    <tbody>
                        <tr><td>{props.nome} {valorReal}</td></tr>
                    </tbody>
            </table>
        );
    }    
};

export default produto;