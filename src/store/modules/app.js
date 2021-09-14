/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-04-27 16:19:07
 * @LastEditTime: 2021-05-10 10:59:59
 * @LastEditors: @Xin (834529118@qq.com)
 */
const state = () => ({
  a: 1,
  todos: [
    { id: 1, text: 'one', done: true },
    { id: 2, text: 'two', done: false },
  ],
  demo: {
    c: 1,
  },
})

const mutations = {
  increment(state) {
    state.a++
    state.demo.c++
  },
  pushTodos(state, payload) {
    state.todos.push(payload)
  },
}
const actions = {
  increment({ commit }, payload) {
    console.log('actionsParams', payload)
    commit('increment')
  },
}

const getters = {
  doneTodos(state) {
    return state.todos.filter(todo => todo.done)
  },
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
