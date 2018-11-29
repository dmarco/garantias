import Vuex from 'vuex'

let cookieparser = require('cookieparser')

const store = () => new Vuex.Store({

  actions: {
    async nuxtServerInit ({ commit, state }, { req }) {
      let accessToken = null

      // console.log(req.headers.cookie)
      if (req.headers.cookie) {
        var parsed = cookieparser.parse(req.headers.cookie)
        if (parsed.auth) {
          accessToken = JSON.parse(parsed.auth)
          commit('setAuth', accessToken)
        }
      }

      let meta = await this.$axios.get()
      commit('setMeta', meta.data)
      if (!state.MainMenu) {
        let mainMenu = await this.$axios.get(`menus/v1/menus/header-menu`)
        commit('setMainMenu', mainMenu.data)
      }
      if (!state.headLess) {
        let headLess = await this.$axios.get(`acf/v3/options/headless-settings`)
        commit('setHeadLess', headLess.data)
      }
    }
  },

  state: {
    xUser: {},
    route: '',
    page: null,
    meta: {
      description: '',
      name: ''
    },
    mainMenu: null,
    headLess: null,
    objectForSeo: null,
    auth: null,
    formUploadFiles: []
  },

  mutations: {
    setXUser (state, data) {
      state.xUser = data
    },
    setObjectForSeo (state, data) {
      state.objectForSeo = data
    },
    setPage (state, data) {
      state.page = data
    },
    setMainMenu (state, data) {
      state.mainMenu = data
    },
    setHeadLess (state, data) {
      state.headLess = data
    },
    setMeta (state, data) {
      state.meta = data
    },
    setAuth (state, data) {
      state.auth = data
    },
    setFormUploadFiles (state, data) {
      state.formUploadFiles = data
    },
    setRoute (state, data) {
      state.route = JSON.stringify(data)
    }
  }
})

export default store
