<script lang="ts">
import { defineComponent } from 'vue';
import type { ValidationError } from '@/interfaces/validation-error';
import { useSessionStore } from '@/stores/session';

import apiAuth from '@/api/auth';

interface UserAccount {

    id: number,
    name: string,
    email: string
}

export default defineComponent({
    name: 'LoginForm',
    mounted: function () {

    
    },
    data() {
        return {
            errors: [] as ValidationError[],
            valid: true,
            overlay: false,
            email: '',
            // email: 'phenomenal.hardy@gmail.com',
            password: '',
            //password: 'password',

            loginButtonText: 'Iniciar Sesion'
        }
    },
    methods: {

        /**
         * handle submit del form
         * @param e 
         */
        handleClickLogin: function (e: Event) {

            // console.log(this.password, this.email);

            this.validateForm();
        },
        /**
         * validacion del formulario
         */
        validateForm: function () {

            // reset
            this.valid = true;
            this.errors = [];

            if (!this.email) {

                this.errors.push({
                    field: 'email',
                    message: 'Debes ingresar tu Correo Electronico'
                });

                this.valid = false;
            }

            if (!this.password) {

                this.errors.push({
                    field: 'password',
                    message: 'Debes ingresar tu Contraseña'
                });

                this.valid = false;
            }

            if (this.valid === true) {

                this.overlay = true;
                this.loginButtonText = 'Iniciando sesion... espere por favor'

                apiAuth.postLogin({
                    email: this.email,
                    password: this.password
                }).then((res) => {

                    if (res.data.success) {

                        this.loginButtonText = 'Login exitoso, redireccionado...'
                        this.redirectAfterSuccessfulLogin(res.data.user);

                    } else {

                        this.errors.push({
                            field: 'password',
                            message: res.data.message
                        });
                        this.overlay = false;

                        this.loginButtonText = 'Iniciar Sesion';
                    }                    

                }).catch((error) => {

                    this.overlay = false;
                    this.loginButtonText = 'Iniciar Sesion';

                });
            }
        },
        redirectAfterSuccessfulLogin: function (user: UserAccount) {

            const sessionStore = useSessionStore();

            let self = this;

            // para emular un login demoroso => 2 segundos
            setTimeout(function () {

                sessionStore.$patch((state) => {
                    state.user = user;
                    state.authenticated = true;
                });

                self.overlay = false;

                self.$router.push({ path: '/' });    

            }, 2000);
                            
        }

    }
})
</script>
<template>
    <div>
        <template>
            <v-form>
                <v-overlay :value="overlay"></v-overlay>
                <v-container>
                    <v-row align="center">

                        <v-col cols="12" md="12">
                            <v-alert v-for="(error, idx) in errors" v-bind:key="error.field" color="red lighten-2" dark>
                                {{ error.message }}
                            </v-alert>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-text-field v-model="email" clearable label="E-mail" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                            <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-btn class="ma-2" :block="true" @click="handleClickLogin" outlined color="indigo">
                                {{ loginButtonText }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </template>
    </div>
</template>