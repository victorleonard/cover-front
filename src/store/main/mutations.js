export function CHANGE_VERSION (state, payload) {
  console.log(payload)
  state.version = payload
}

export function CHANGE_LOADING_STATE (state, payload) {
  state.loading = payload
}

export function LOG_OUT (state) {
  state.profile = undefined
  state.user = undefined
  state.currentGroup = undefined
  state.token = undefined
  state.myGroups = undefined
  localStorage.removeItem('token')
}

export function UPDATE_SONG_LIST (state, payload) {
  state.songsList = payload
}

export function UPDATE_MY_ASKING_INVITATIONS (state, payload) {
  state.myAskingInvitations = payload
}

export function UPDATE_MY_DEMAND_INVITATIONS (state, payload) {
  state.myDemandInvitations = payload
}

export function UPDATE_USERS (state, payload) {
  state.users = payload
}

export function UPDATE_USER (state, payload) {
  state.user = payload
}

export function UPDATE_PROFILE (state, payload) {
  state.profile = payload
}

export function UPDATE_TOKEN (state, payload) {
  state.token = payload
}

export function UPDATE_MY_CREATOR_GROUPS (state, payload) {
  state.myCreatorGroups = payload
}

export function CLEAR_GROUPS (state, payload) {
  state.myGroups = []
}

export function ADD_GROUP (state, payload) {
  state.myGroups.push(payload)
}

export function UPDATE_MY_GROUPS (state, payload) {
  state.myGroups = payload
}

export function UPDATE_MY_GROUPS_USER (state, { groupId, userId, profile }) {
  const group = state.myGroups.find(g => g.id === groupId)
  const user = group.users.find(u => u.id === userId)
  user.profile = profile
}

export function UPDATE_GROUPS_USER (state, { groupId, userId, profile }) {
  const group = state.groups.find(g => g.id === groupId)
  const user = group.users.find(u => u.id === userId)
  user.profile = profile
}

export function UPDATE_CURRENT_GROUP (state, payload) {
  state.currentGroup = payload
}

export function RESET_CURRENT_GROUP (state, payload) {
  state.currentGroup = undefined
  state.currentGroupSongs = undefined
  state.currentRefuseGroupSongs = undefined
}

export function UPDATE_CURRENT_GROUP_PROFILE (state, payload) {
  state.currentGroupProfile = payload
}

export function UPDATE_CURRENT_GROUP_SONGS (state, payload) {
  state.currentGroupSongs = payload
}

export function UPDATE_CURRENT_REFUSE_GROUP_SONGS (state, payload) {
  state.currentRefuseGroupSongs = payload
}

export function UPDATE_GROUPS (state, payload) {
  state.groups = payload
}

export function UPDATE_MY_GROUP (state, payload) {
  console.log('UPDATE_MY_GROUP paylod', payload)
  state.myGroups.push(payload)
  console.log('state.myGroupsstate.myGroupsstate.myGroupsstate.myGroups', state.myGroups)
}

export function CLEAR_MY_GROUP (state) {
  state.myGroups = []
}
