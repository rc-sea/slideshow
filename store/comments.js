import axios from "axios";
const baseUrl = process.env.BASE_URL;

export const state = () => ({
    topics: [],
    posts: [],
    topic_id: null
})

export const mutations = {
    init(state) {
      state.topics = [];
      state.posts = [];
      state.topic_id = null;
    },
    parsetopics(state, data) {
      state.topics = data.topic_list.topics;
    },
    parseposts(state, data) {
      state.posts = data.post_stream.posts;
      state.topic_id = data.topic_id;
    },
    settopic_id(state, data) {
      for (let i = 0; i < state.topics.length; i ++) {
        if (state.topics[i].title === data.title) {
          state.topic_id = state.topics[i].id;
          break;
        }
      }
    }
}

export const actions = {
  async getTopics({ commit }) {
    try{
        var { data } = await axios.get(`/api/comments/topics`);
        commit('parsetopics', data)
    } catch(error) {
        console.log(error);
    }
  },
  async getComments({ commit }, params) {
    try{
        var { data } = await axios.get(`/api/comments/posts`, {
          params: {
            topic_id: params.topic_id
          }
        });
        commit('parseposts', { ...data, topic_id: params.topic_id });
    } catch(error) {
        console.log(error);
    }
  },
}