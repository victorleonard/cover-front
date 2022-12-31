export default {
  apiHost: process.env.DEV ? 'http://localhost:1337' : 'https://cover-mobile.herokuapp.com/',
  frontHost: process.env.DEV ? 'http://localhost:8080' : 'https://front-cover.herokuapp.com',
  version: undefined,
  loading: false,
  songsList: undefined,
  user: undefined,
  profile: undefined,
  myCreatorGroups: undefined,
  currentGroup: undefined,
  currentGroupSongs: undefined,
  currentRefuseGroupSongs: undefined,
  currentGroupVotes: undefined,
  myGroups: undefined,
  groups: undefined,
  token: undefined,
  myAskingInvitations: undefined,
  myDemandInvitations: undefined,
  error: {
    display: false,
    type: '',
    message: ''
  },
  currentMessage: undefined
}
