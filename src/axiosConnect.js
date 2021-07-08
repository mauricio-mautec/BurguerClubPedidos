import axios from 'axios';

export default axios.create ({
    baseURL: 'https://fabrica-pedidos.firebaseio.com/'
});