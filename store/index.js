
export const state = () => ({
  detailsPage_url: null
})
export const mutations = {
  set_details_url(state, page) {
    state.detailsPage_url = page
  }
}
