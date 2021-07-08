import React from 'react';
import classes from './Comando.module.css';
import Button from '../UI/Button/Button';

function comando (props) {
    return(
    <div className={classes.Comando}>
        <Button btnType="Alert" clicked={()=>{window.open("http://pedidos", "_blank")}}>NOVO</Button>&nbsp;
        <Button btnType="Alert" clicked={props.showInfoCliente}>CLIENTE</Button>
    </div>
    );
}

export default comando;
