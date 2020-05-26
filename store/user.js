import axios from "axios";

export const state = () => ({
    user: null
})

export const mutations = {
    SET_USER(state, data) {
        state.user = data
    }
}

export const actions = {
    async set_user({ commit }, payload) {
        try{
            var { data } = await axios.get(`/api/user`, {
                params: {
                    user: payload.user
                }
            });
            console.log(data);
            commit('SET_USER', data);
        } catch(error) {
            console.log(error);
        }
    }
}