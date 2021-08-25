import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import mobileView from "./mobileView";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        auth,
        mobileView
    }
});
