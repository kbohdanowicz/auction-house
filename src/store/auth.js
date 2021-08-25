import axios from "axios";
import io from "@/../node_modules/socket.io-client";

const state = {
    currentUser: {
        username: null,
        isAuth: false,
        notifications: [],
        isNewNotification: false
    },
    socket: null
};

const getters = {
    currentUser: state => state.currentUser,
    socket: state => state.socket,
    notifications: state => state.notifications,
    isNewNotification: state => state.isNewNotification
};

const actions = {
    fetchCurrentUser ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get("/api/current-user")
                .then((res) => {
                    commit("authRefresh", res.data);
                    resolve(res);
                })
                .catch((err) => {
                    commit("authNotLoggedIn");
                    reject(err);
                });
        });
    },
    connectSocket ({ commit }) {
        commit("connectSocket");
        console.log("Created socket");
    },
    setIsNewNotificationTrue ({ commit }) {
        commit("setIsNewNotificationTrue");
    },
    setIsNewNotificationFalse ({ commit }) {
        axios.patch("/api/current-user")
            .then((res) => {
                commit("setIsNewNotificationFalse");
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

const mutations = {
    authRefresh (state, data) {
        state.currentUser.username = data.username;
        state.currentUser.isAuth = data.isAuth;
        state.currentUser.notifications = data.notifications;
        state.currentUser.isNewNotification = data.isNewNotification;
    },
    authNotLoggedIn (state) {
        state.currentUser.username = null;
        state.currentUser.isAuth = false;
        state.currentUser.notifications = [];
        state.currentUser.isNewNotification = false;
    },
    setIsNewNotificationTrue (state) {
        state.currentUser.isNewNotification = true;
    },
    setIsNewNotificationFalse (state) {
        state.currentUser.isNewNotification = false;
    },
    connectSocket () {
        state.socket = io();
    },
    disconnectSocket () {
        state.socket = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
