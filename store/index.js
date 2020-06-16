
export const state = () => ({
  detailsPage_url: null,
  tag_nav: false,
  browse_loading: true,
  search_tag: null,
  search_type: null,
  just_login: false,
});
export const mutations = {
  set_details_state (state, page) {
    state.detailsPage_url = page.detailsPage_url;
    state.search_tag = page.search_tag;
    state.search_type = page.search_type;
  },
  set_tag_nav (state, flag) {
    state.tag_nav = flag;
  },
  set_browse_loading (state, flag) {
    state.browse_loading = flag;
  },
  set_just_login (state, flag) {
    state.just_login = flag;
  },
};
