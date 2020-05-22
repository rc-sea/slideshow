import axios from "axios";
const baseUrl = process.env.BASE_URL;

export const state = () => ({
    resources: [],
})

export const mutations = {
    InitResources(state, sourceResourcess) {
        state.resources = sourceResourcess
    }
}
export const getters = {
    totalNumber(state) {
        return state.resources.length;
    }
}

export const actions = {
    async initresources({ commit }) {
        try{
            var { data } = await axios.get(`${baseUrl}/api/search`);
            commit('InitResources', data.resources)
        } catch(error) {
            console.log(error);
        }
    },
    async search({ commit }, params) {
        try{
            var { data } = await axios.get(`${baseUrl}/api/search`, {
                params: {
                    searchtag: params.searchtag,
                    type: params.type
                }
            });
            commit('InitResources', data.resources)
        } catch(error) {
            console.log(error);
        }
    }
}