import axios from "axios";
const baseUrl = process.env.BASE_URL;

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
            var { data } = await axios.get(`${baseUrl}/api/tags`);
            commit('parsetags', data.tags)
        } catch(error) {
            console.log(error);
        }
        
    }
}