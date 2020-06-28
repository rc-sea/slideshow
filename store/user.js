import axios from 'axios';
import { setLocalStorageValue } from '~/util/localStorage';

export const state = () => ({
  user: null,
  editor_role: false,
});

export const mutations = {
  SET_USER (state, data) {
    state.user = data;
    if (!data) {
      state.editor_role = false;
    } else if (data.roles && data.roles.length) {
      data.roles.forEach(role => {
        if (role.name === 'tag-editor') {
          state.editor_role = true;
        }
      });
    }
    setLocalStorageValue('rememberinglouise_user', data);
  },
};

export const actions = {
  async set_user ({ commit }, payload) {
    try {
      var { data } = await axios.get('/api/user', {
        params: {
          user: payload.user,
        },
      });
      var { data: roles } = await axios.get('/api/role', {
        params: {
          id: payload.user.sub,
        },
      });

      if (data) {
        data.roles = roles;
      }
      commit('SET_USER', data);
    } catch (error) {
      console.log(error);
    }
  },
};
