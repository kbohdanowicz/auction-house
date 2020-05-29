import axios from "axios";
// import router from "../router";

const state = {
    currentUser: {}
};

const getters = {
    currentUser: state => state.currentUser
};

const actions = {
    fetchCurrentUser ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get("/api/current-user")
                .then((resp) => {
                    commit("authRefresh", resp.data);
                    resolve(resp);
                })
                .catch((err) => {
                    commit("authNotLoggedIn");
                    reject(err);
                });
        });
    }
};

const mutations = {
    authRefresh (state, data) {
        state.currentUser.username = data.username;
        state.currentUser.isAuth = data.isAuth;
    },
    authNotLoggedIn (state) {
        state.currentUser.username = null;
        state.currentUser.isAuth = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
