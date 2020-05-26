import axios from "axios";

export const state = () => ({
    tags: [],
    selectedTags: []
})

export const mutations = {
    parsetags(state, sourceTags) {
        state.tags = sourceTags
    }
}

export const actions = {
    async gettags({ commit }) {
        try{
            var { data } = await axios.get(`/api/tags`);
            commit('parsetags', data.tags)
        } catch(error) {
            console.log(error);
        }
        
    }
}