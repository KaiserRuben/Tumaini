import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';
import {axiosPost} from "@/utils/axiosWrapper";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        accessToken: null,
        loggingIn: false,
        loginError: null,
        level: 0
    },
    mutations: {
        loginStart: state => state.loggingIn = true,
        loginStop: (state, errorMessage) => {
            state.loggingIn = false;
            state.loginError = errorMessage;
        },
        updateAccessToken: (state, data) => {
            state.accessToken = data[0];
            state.level = data[1];
        },
        logout: (state) => {
            state.accessToken = null;
            state.level = 0;
        }
    },
    actions: {
        doLogin({commit}, loginData) {
            commit('loginStart');
            axiosPost('/users/validate', {
                email: loginData.email.toLowerCase(),
                password: loginData.password
            })
                .then(response => {
                    console.log(response.data.data)
                    const level = response.data.data.level
                    const isAdmin = level >= 1
                    if (!response.data.hasError && isAdmin) {
                        localStorage.setItem('accessToken', response.data.data._id);
                        localStorage.setItem('level', level);
                        commit('loginStop', null);
                        commit('updateAccessToken', [response.data.data._id, level]);


                        localStorage.setItem('email', loginData.email);
                        if (loginData.rememberMeChecked) {
                            localStorage.setItem('password', loginData.password);
                        } else {
                            localStorage.removeItem('password');
                        }
                        router.push({name: 'Dashboad'});
                    } else {
                        if (response.data.hasError) commit('loginStop', response.data.data);
                        else commit('loginStop', "You dont have admin privileges. Please request them at 'whyAmINotAdmin@kaiser.fyi'");
                        commit('updateAccessToken', [null, 0]);
                    }
                })
                .catch(error => {
                    console.error(error)
                    commit('loginStop', error.response.data.error);
                    commit('updateAccessToken', [null, 0]);
                })
        },
        fetchAccessToken({commit}) {
            commit('updateAccessToken', [localStorage.getItem('accessToken'), localStorage.getItem('level')]);
        },
        logout({commit}) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('level');
            commit('logout');
            router.push('/Login');
        }
    }
})
