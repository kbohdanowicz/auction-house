import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        unreadMessages: 0 // TODO load messages
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        auth
    }
});
