import { httpClient } from "./httpClient";

export default {

    async postLogin(payload: {
        email: string,
        password: string,
    }) {

        return httpClient.post('auth/login', payload);
    }
}