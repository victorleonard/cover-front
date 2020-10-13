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
  },
  getMyDemandInvitation (to) {
    return Api().get('/invitations?to=' + to)
  },
  acceptInvitation (demand) {
    return Api().put('/invitations/' + demand.id, {
      status: 'accept'
    })
  }
}
