import axios from 'axios';

export const state = () => ({
  resources: [],
  resources_loading: false,
  untagged_count: 0,
  untagged_loading: false,
  next_cursor: '',
  total_count: 0,
});

export const mutations = {
  set_resources_loading (state, flag) {
    state.resources_loading = flag;
  },
  parse (state, data) {
    state.resources = data.resources;
    state.next_cursor = data.next_cursor;
    state.total_count = data.total_count;
  },
  set_untagged_count (state, data) {
    state.untagged_count = data;
  },
  set_untagged_loading (state, data) {
    state.untagged_loading = data;
  },
  merge (state, data) {
    state.resources = state.resources.concat(data.resources);
    state.next_cursor = data.next_cursor;
  },
};

export const actions = {
  async search ({ commit }, params) {
    try {
      commit('set_resources_loading', true);
      var { data } = await axios.get('/api/search', {
        params: {
          searchtag: params.searchtag,
          type: params.type,
        },
      });

      commit('parse', data);
    } catch (error) {
      console.log(error);
    } finally {
      commit('set_resources_loading', false);
    }
  },
  async searchmore ({ state, commit }, params) {
    if (!state.next_cursor || !state.next_cursor.length || state.untagged_loading) return;
    try {
      var { data } = await axios.get('/api/search', {
        params: {
          searchtag: params.searchtag,
          type: params.type,
          next_cursor: state.next_cursor,
        },
      });

      commit('merge', data);
    } catch (error) {
      console.log(error);
    }
  },
  async untagged ({ commit, state }) {
    if (state.untagged_loading) return;

    try {
      commit('set_untagged_loading', true);
      var { data } = await axios.get('/api/search', {
        params: {
          searchtag: '-',
        },
      });

      commit('set_untagged_count', data.resources.length);
    } catch (error) {
      console.log(error);
    } finally {
      commit('set_untagged_loading', false);
    }
  },
  async untaggedCount ({ commit, state }) {
    try {
      commit('set_untagged_loading', true);
      const { data } = await axios.get('/api/untagged');

      commit('set_untagged_count', data.count);
    } catch (e) {
      console.error(e);
    } finally {
      commit('set_untagged_loading', false);
    }
  },
};
