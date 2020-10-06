export function CHANGE_LOADING_STATE (state, payload) {
  state.loading = payload
}

export function UPDATE_SONG_LIST (state, payload) {
  state.songsList = payload
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

export function UPDATE_CURRENT_GROUP (state, payload) {
  state.currentGroup = payload
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
