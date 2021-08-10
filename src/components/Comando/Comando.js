import React from 'react';
import classes from './Comando.module.css';
import Button from '../UI/Button/Button';

function comando (props) {
    return(
    <div className={classes.Comando}>
        <Button btnType="Alert" clicked={()=>{window.open("http://pedidos", "_blank")}}>NOVO CLIENTE</Button>&nbsp;
        <Button btnType="Alert" clicked={props.showInfoCliente}>{props.cliente}</Button>
    </div>
    );
}

export default comando;
