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
                    commit("authRefresh", resp.data.user);
                    resolve(resp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};

const mutations = {
    authRefresh (state, currentUser) {
        state.currentUser = currentUser;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
