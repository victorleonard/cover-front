import SongService from './../../services/SongService'
import UserService from './../../services/UserService'
import GroupService from './../../services/GroupService'
import FileService from './../../services/FileService'
import InstrumentService from './../../services/InstrumentService'
import InvitationService from './../../services/InvitationService'

export async function getVersion () {
  const r = await UserService.getVersion()
  return r
}

export function setLocalVersion ({ commit }, { version }) {
  commit('CHANGE_VERSION', version)
}

export function changeLoadingState ({ commit }, state) {
  commit('CHANGE_LOADING_STATE', state)
}

export function logout ({ commit }) {
  commit('LOG_OUT')
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

export async function setIosDeviceToken ({ commit, state }, { token }) {
  const userId = state.user.id
  const r = await UserService.setIosDeviceToken(userId, token)
  return r
}

export async function searchOnSpotify ({ commit, state }, { song, plateform }) {
  const r = await SongService.searchOnSpotify(song, plateform)
  return r
}

export async function selectSong ({ commit, state }, { song, comment }) {
  const r = await SongService.selectSong(song, comment, state.currentGroup.id, state.user.id)
  return r
}

export async function vote ({ commit, state }, { value, songId, comment }) {
  const r = await SongService.vote(value, songId, state.currentGroup.id, state.user.id, comment)
  return r
}

export async function updateVote ({ commit, state }, { voteId, value, comment }) {
  const r = await SongService.updateVote(voteId, value, comment)
  return r
}

export async function updateLevel ({ commit, state }, { voteId, value, comment }) {
  const r = await SongService.updateLevel(voteId, value)
  return r
}

export async function getCurrentGroup ({ commit, dispatch }, { groupId }) {
  const r = await GroupService.getGroup(groupId)
  /* const groupProfilesTemp = []
  const res = r.data.users.map(async (u) => {
    const p = await dispatch('getProfile', {
      profileId: u.profile
    })
    groupProfilesTemp.push(p.data)
  })
  await Promise.all(res)
  r.data.profiles = groupProfilesTemp */
  commit('UPDATE_CURRENT_GROUP', r.data)
  return r
}

export async function getCurrentGroupSongs ({ commit, state }, { groupId }) {
  const r = await SongService.getGroupSongs(groupId)
  commit('UPDATE_CURRENT_GROUP_SONGS', r.data)
  return r
}

export async function resetCurrentGroup ({ commit }) {
  commit('RESET_CURRENT_GROUP')
}
/* export async function getMyGroups ({ commit, state }) {
  commit('CLEAR_GROUPS')
  const myGroupsId = state.user.groups
  myGroupsId.forEach(async groupId => {
    const r = await GroupService.getGroup(groupId)
    commit('ADD_GROUP', r.data)
  })
} */

export async function getMyGroups ({ commit, state, dispatch }) {
  const groups = []
  commit('CLEAR_GROUPS')
  const res = state.user.groups.map(async g => {
    const r = await dispatch('getGroup', {
      groupId: g
    })
    groups.push(r)
    commit('ADD_GROUP', r.data)
  })
  await Promise.all(res)
  return groups
  /* const r = await GroupService.getMyGroups(state.user.id)
  const groups = [...r.data]
  commit('UPDATE_MY_GROUPS', groups)
  groups.forEach(group => {
    group.users.map(user => {
      dispatch('getProfile', {
        profileId: user.profile
      })
        .then(p => {
          commit('UPDATE_MY_GROUPS_USER', {
            groupId: group.id,
            userId: user.id,
            profile: p.data
          })
        })
    })
  })
  return r */
}

export async function getGroups ({ dispatch, commit }) {
  const r = await GroupService.getGroups()
  const groups = [...r.data]
  commit('UPDATE_GROUPS', r.data)
  groups.forEach(group => {
    group.users.map(user => {
      dispatch('getProfile', {
        profileId: user.profile
      })
        .then(p => {
          commit('UPDATE_GROUPS_USER', {
            groupId: group.id,
            userId: user.id,
            profile: p.data
          })
        })
    })
  })
  return r
}

export async function getGroup ({ commit, state }, { groupId }) {
  const r = await GroupService.getGroup(groupId)
  return r
}

export async function askInvitation ({ state }, { group, to, message }) {
  const from = state.user.id
  const r = await InvitationService.askInvitation(group, to, from, message)
  return r
}

export async function getMyAskingInvitation ({ commit, state }) {
  const from = state.user.id
  const r = await InvitationService.getMyAskingInvitation(from)
  commit('UPDATE_MY_ASKING_INVITATIONS', r.data)
  return r
}

export async function getMyDemandInvitation ({ commit, state }) {
  const to = state.user.id
  const r = await InvitationService.getMyDemandInvitation(to)
  commit('UPDATE_MY_DEMAND_INVITATIONS', r.data)
  return r
}

export async function acceptInvitation ({ commit, state }, demand) {
  const r = await InvitationService.acceptInvitation(demand)
  return r
}

export async function getInstruments ({ commit, state }) {
  const r = await InstrumentService.getInstruments()
  return r
}

export async function addGroupMember ({ commit, state }, { groupId, userId }) {
  const r = await GroupService.addGroupMember(groupId, userId)
  return r
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
  GroupService.getMyCreatorGroups(state.user.id)
    .then(resp => {
      commit('UPDATE_MY_CREATOR_GROUPS', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function register ({ commit, dispatch }, { username, email, password }) {
  const response = await UserService.register(username, email, password)
  if (response) {
    return response.data
  } else {
    console.error('error')
  }
}

export async function sendEmailConfirmation ({ commit }, { email }) {
  const r = await UserService.sendEmailConfirmation(email)
  return r
}

export async function forgotPassword ({ commit }, { email }) {
  const r = await UserService.forgotPassword(email)
  return r
}

export async function resetPassword ({ commit }, { code, password, passwordConfirmation }) {
  const r = await UserService.resetPassword(code, password, passwordConfirmation)
  return r
}

export async function connectUser ({ commit, dispatch }, { email, password }) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await UserService.logIn(email, password)
  if (response) {
    localStorage.setItem('token', response.data.jwt)
    commit('UPDATE_TOKEN', response.data.jwt)
    commit('UPDATE_USER', response.data.user)
    commit('CHANGE_LOADING_STATE', false)
    if (!response.data.user.profile) {
      dispatch('createProfile', {
        pseudo: response.data.user.username
      })
    } else {
      dispatch('getProfile', {
        profileId: response.data.user.profile.id
      })
    }
    return response
  } else {
    alert('error')
    console.error('error')
  }
}

export async function getMe ({ commit }) {
  const r = await UserService.getMe()
  commit('UPDATE_USER', r.data)
}

/* export async function getUser ({ commit, dispatch }, { userId }) {
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
} */

export async function getProfile ({ commit, state }, { profileId }) {
  const r = await UserService.getProfile(profileId)
  // commit('UPDATE_PROFILE', r.data[0])
  return r
}

export async function getProfiles ({ commit, state }) {
  const r = await UserService.getProfiles()
  return r
}

export async function getMyProfile ({ state, commit }) {
  const userId = state.user.profile
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

export async function updateProfile ({ state, commit }, { pseudo, instruments, avatar, commune, codeDepartement, codeRegion }) {
  const id = state.user.profile
  const r = await UserService.updateProfile(id, pseudo, instruments, avatar, commune, codeDepartement, codeRegion)
  commit('UPDATE_PROFILE', r.data)
  return r
}

export async function createGroup ({ state, commit }, { name, commune, codeDepartement, codeRegion, image, country }) {
  commit('CHANGE_LOADING_STATE', true)
  const userId = state.user.id
  const r = await GroupService.createGroup(userId, name, commune, codeDepartement, codeRegion, image, country)
  commit('CHANGE_LOADING_STATE', false)
  return r.data
}

export async function updateGroup ({ state, commit }, { groupId, name, image }) {
  commit('CHANGE_LOADING_STATE', true)
  const r = await GroupService.updateGroup(groupId, name, image)
  commit('CHANGE_LOADING_STATE', false)
  return r.data
}

export async function upload ({ state, commit }, { file }) {
  commit('CHANGE_LOADING_STATE', true)
  const r = await FileService.uploadFile(file)
  commit('CHANGE_LOADING_STATE', false)
  return r.data
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
