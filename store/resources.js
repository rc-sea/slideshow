import axios from "axios";
const baseUrl = process.env.BASE_URL;

export const state = () => ({
    resources: [],
    next_cursor: '',
    total_count: 0
})

export const mutations = {
    init(state, data) {
        state.resources = data.resources
        state.next_cursor = data.next_cursor
        state.total_count = data.total_count
    },
    merge(state, data) {
        state.resources = state.resources.concat(data.resources)
        state.next_cursor = data.next_cursor
    },
}

export const actions = {
    async initresources({ commit }) {
        try{
            var { data } = await axios.get(`${baseUrl}/api/search`);
            commit('init', data)
        } catch(error) {
            console.log(error);
        }
    },
    async search({ commit }, params) {
        try{
            var { data } = await axios.get(`${baseUrl}/api/search`, {
                params: {
                    searchtag: params.searchtag,
                    type: params.type,
                }
            });
            commit('init', data)
        } catch(error) {
            console.log(error);
        }
    },
    async searchmore({ state, commit }, params) {
        if (!state.next_cursor || !state.next_cursor.length) return;
        try{
            var { data } = await axios.get(`${baseUrl}/api/search`, {
                params: {
                    searchtag: params.searchtag,
                    type: params.type,
                    next_cursor: state.next_cursor
                }
            });
            commit('merge', data)
        } catch(error) {
            console.log(error);
        }
    }
}