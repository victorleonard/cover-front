import orderBy from 'lodash/orderBy'

export function groups (state) {
  return state.myGroups
}

export function average (state) {
  if (state.users) {
    return parseInt((state.users.length * 5) / 1.2)
  }
}

export function vetoVote (state) {
  if (state.songsList) {
    const result = []
    state.songsList.forEach(song => {
      if (song.vote.find(vote => vote.value === 0)) {
        result.push(song)
      }
    })
    return result
  }
}

export function selectionWithoutVeto (state) {
  if (state.songsList) {
    const result = []
    state.songsList.forEach(selection => {
      if (!selection.vote.find(vote => vote.value === 0)) {
        result.push(selection)
      }
    })
    return orderBy(result, ['creationDate'], ['desc'])
  }
}

export function awaitingVote (state, getters) {
  if (state.currentGroupSongs) {
    return state.currentGroupSongs.filter(song => {
      return !song.votes.find(vote => vote.profile_id === state.user.id)
    })
  }
}

export function myAwaitingVote (state, getters) {
  if (state.songsList && state.users && getters.selectionWithoutVeto) {
    return getters.selectionWithoutVeto.filter(el => {
      return el.vote.length < state.users.length
    })
  }
}

export function allVote (state) {
  if (state.songsList && state.users) {
    return state.songsList.filter(el => {
      return el.vote.length === state.users.length
    })
  }
}
