import axios from 'axios';
import router from '../router/index';

import { useSessionStore } from '@/stores/session';


export const httpClient = axios.create({

    // puerto 8000 en laravel
    // usar php artisan serve

    baseURL: `http://localhost:8000/api`,
    headers: {

        'Accept': 'application/json',
        'Content-Type' : 'application/json',
        'X-Requested-With': 'XMLHttpRequest',        
        'Access-Control-Allow-Origin': '*',
        
        // 'Authorization': "Bearer " + localStorage.getItem('jwt'),        
    }
});


httpClient.interceptors.response.use(

function(response) {
    
    return response;

}, 
function(error) {

    console.log(error);

    if(error.response.status === 401) {

        //const sessionStore = useSessionStore();
        //sessionStore.clearSession();
        router.push('/auth/login');
    }

    return Promise.reject(error);
});
