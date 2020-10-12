import Api from './Api.js'

export default {
  askInvitation (group, to, from) {
    return Api().post('/invitations', {
      group: group,
      to: to,
      from: from
    })
  },
  getMyAskingInvitation (from) {
    return Api().get('/invitations?from=' + from)
  }
}
