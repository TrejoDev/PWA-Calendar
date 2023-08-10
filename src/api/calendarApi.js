import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables()


const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

// Todo: configurar interceptores
calendarApi.interceptors.request.use( config => {   //Los interceptores se utilizan para modificar las peticiones, ya sea antes o despues.

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')    //Establecemos q con cada peticion venga en el header un valor llamado 'x-token' : token almacenado en el localStorage
    }

    return config;
})


export default calendarApi;



