const state = {
    isMobileView: false
};

const getters = {
    isMobileView: state => state.isMobileView
};

const actions = {
    calculateView ({ commit }, windowWidth) {
        if (windowWidth <= 680) {
            commit("setTrue");
        } else {
            commit("setFalse");
        }
    }
};

const mutations = {
    setTrue (state) {
        state.isMobileView = true;
    },
    setFalse (state) {
        state.isMobileView = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
