import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Polyfill for window.fetch()
require('whatwg-fetch')

const store = () => new Vuex.Store({
  state: {
    currentUser: null,
    learnedExams: null
  },
  mutations: {
    SET_USER: function (state, user) {
      state.currentUser = user
    },
    SET_LEANED: function (state, exams){
      console.log("SET: " + exams);
      state.learnedExams = exams
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.currentUser) {
        commit('SET_USER', req.session.currentUser)
        commit('SET_LEANED', req.session.learnedExams)
      }
    },
    signin ({ commit }, { username, password }) {
      return fetch('/api/signin', {
        // Send the client cookies to the server
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      }).then(function(res){
        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res.json()
        }
      }).then(function(currentUser) {
        commit('SET_USER', currentUser);
      });
    },
    signup ({commit}, {username, password, confirmPassword}) {
      return fetch('/api/signup', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword
        })
      }).then( res => {
        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res.json()
        }
      }).then( (currentUser) => {
        commit('SET_USER', currentUser)
      });
    },
    logout ({ commit }) {
      return fetch('/api/logout', {
        // Send the client cookies to the server
        credentials: 'same-origin',
        method: 'POST'
      }).then(function() {
        commit('SET_USER', null)
      });
    },
    learned ({ commit }, {exams}) {
      return fetch( '/api/learned', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          exams,
        })
      }).then( res => {
        if (res.status === 401) {
          throw new Error('Bad credentials')
        } else {
          return res.json()
        }
      }).then( learnedExams => {
        commit('SET_LEANED', learnedExams)
      })
    }
  }
})

export default store

