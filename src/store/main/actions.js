import SongService from './../../services/SongService'
import UserService from './../../services/UserService'
import GroupService from './../../services/GroupService'

export function changeLoadingState ({ commit }, state) {
  commit('CHANGE_LOADING_STATE', state)
}

export async function loadSongs ({ commit }, silent) {
  if (!silent) {
    commit('CHANGE_LOADING_STATE', true)
  }
  SongService.getSongs()
    .then(resp => {
      commit('UPDATE_SONG_LIST', resp.data.selection)
      commit('CHANGE_LOADING_STATE', false)
    })
    .catch(error => {
      commit('CHANGE_LOADING_STATE', false)
      console.error('error', error)
    })
}

export async function loadUsers ({ commit }) {
  UserService.getUsers()
    .then(resp => {
      commit('UPDATE_USERS', resp.data.users)
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function addMember ({ commit, state }, { groupId, userId, role, username }) {
  GroupService.addMember(groupId, userId, role, username)
    .then(resp => {
      console.log('addmember', resp)
      // commit('UPDATE_MY_GROUPS', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function getUserNameFromProfile ({ commit, state }, { userId }) {
  const response = await UserService.getProfile(userId)
  if (response) {
    return response.data
  }
}

export async function loadMyGroups ({ commit, state, dispatch }) {
  console.log('LOAD MY GROUPS')
  commit('CLEAR_MY_GROUP')
  GroupService.getMyGroups(state.user.id)
    .then(el => {
      // let groups = [...new Set(el.data)]
      const groups = el.data
      console.log('GOUPS', groups)
      groups.forEach(el => {
        const group = el
        GroupService.getMembers(el.id)
          .then(resp => {
            console.log('GET MEMBERS', resp)
            const members = []
            resp.data.forEach(el => {
              const member = el
              dispatch('getUserNameFromProfile', {
                userId: el.userId
              })
                .then(resp => {
                  member.profile = resp[0]
                })
              /* UserService.getProfile(el.userId)
                .then(resp => {
                  console.log('get progile resp', resp)
                  member.profile = resp.data[0]
                }) */
              members.push(member)
            })
            group.members = members
            console.log('sdfojsdlfkjslk', group)
            commit('UPDATE_MY_GROUP', group)
          })
      })
    })
    .catch(error => {
      console.error('error', error)
    })
}

/* export async function loadMembersGroup ({commit, state}, {groupId}) {
  GroupService.getMembers(groupId)
    .then(resp => {
      resp.data.forEach(el => {
        console.log('el=======>', el)
      })
      commit('UPDATE_MY_GROUP', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
} */

export async function loadMyCreatorGroups ({ commit, state }) {
  console.log('state.user.id', state.user.id)
  GroupService.getMyCreatorGroups(state.user.id)
    .then(resp => {
      commit('UPDATE_MY_CREATOR_GROUPS', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function register ({ commit, dispatch }, { username, email, password }) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await UserService.register(username, email, password)
  if (response) {
    commit('CHANGE_LOADING_STATE', false)
    return response.data
  } else {
    console.error('error')
  }
}

export async function connectUser ({ commit, dispatch }, { email, password }) {
  console.log('connect user')
  commit('CHANGE_LOADING_STATE', true)
  const response = await UserService.logIn(email, password)
  if (response) {
    localStorage.setItem('token', response.data.jwt)
    commit('UPDATE_TOKEN', response.data.jwt)
    commit('UPDATE_USER', response.data.user)
    /* dispatch('getUser', {
      userId: response.data.user.id
    }) */
    // commit('UPDATE_USER', response.data)
    commit('CHANGE_LOADING_STATE', false)
    return response
  } else {
    console.error('error')
  }
}

export async function getUser ({ commit, dispatch }, { userId }) {
  UserService.getUser(userId)
    .then(resp => {
      console.log('GET USER', resp)
      commit('UPDATE_USER', resp.data)
      localStorage.setItem('userId', resp.data.id)
      localStorage.setItem('userEmail', resp.data.email)
      localStorage.setItem('username', resp.data.username)
      dispatch('loadMyCreatorGroups')
      dispatch('loadMyGroups')
        .then(resp => {
          console.log('HO HO HO HO===================', resp)
        })
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function getProfile ({ commit, dispatch }, { userId }) {
  const r = await UserService.getProfile(userId)
  commit('UPDATE_PROFILE', r.data[0])
  return r
}

export async function createProfile ({ state, commit }, { pseudo }) {
  const userId = state.user.id
  const r = await UserService.createProfile(pseudo, userId)
  commit('UPDATE_PROFILE', r.data)
  return r
}

export async function updateProfile ({ state, commit }, { pseudo }) {
  const id = state.profile.id
  const r = await UserService.updateProfile(id, pseudo)
  commit('UPDATE_PROFILE', r.data)
  return r
}

export async function createGroup ({ commit, dispatch }, { name, genre, departement, commune, level, creatorId, role }) {
  commit('CHANGE_LOADING_STATE', true)
  const profile = await UserService.getProfile(creatorId)
  if (profile) {
    const profileData = profile.data[0]
    const response = await GroupService.createGroup(name, genre, departement, commune, level, creatorId)
    if (response) {
      console.log('profileData', profileData)
      dispatch('addMember', {
        userId: creatorId,
        groupId: response.data.id,
        role: role,
        username: profileData.username
      })
      dispatch('loadMyGroups')
      commit('CHANGE_LOADING_STATE', false)
      // return response.data
    } else {
      console.error('error')
    }
  }
}

export async function deleteMyCreatorGroup ({ commit, dispatch }, { groupId }) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await GroupService.deleteMyGroup(groupId)
  if (response) {
    dispatch('loadMyCreatorGroups')
    commit('CHANGE_LOADING_STATE', false)
    return response.data
  } else {
    console.error('error')
  }
}
