import axios from "axios";
const baseUrl = process.env.BASE_URL;

export const state = () => ({
    user: null
})

export const mutations = {
    init(state, data) {
        state.user = data
    }
}

export const actions = {
    login({ commit }, data) {
        commit('init', data.user);
    }
}