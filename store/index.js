
export const state = () => ({
  detailsPage_url: null,
  tag_nav: false,
  browse_loading: true
})
export const mutations = {
  set_details_url(state, page) {
    state.detailsPage_url = page
  },
  set_tag_nav(state, flag) {
    state.tag_nav = flag
  },
  set_browse_loading(state, flag) {
    state.browse_loading = flag
  }
}
