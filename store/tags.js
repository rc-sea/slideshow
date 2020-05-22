import axios from "axios";
const baseUrl = process.env.BASE_URL;

export const state = () => ({
    tags: [],
    selectedTags: []
})

export const mutations = {
    InitTags(state, sourceTags) {
        state.tags = sourceTags
    }
}

export const actions = {
    async inittags({ commit }) {
        try{
            var { data } = await axios.get(`${baseUrl}/api/tags`);
            commit('InitTags', data.tags)
        } catch(error) {
            console.log(error);
        }
        
    }
}