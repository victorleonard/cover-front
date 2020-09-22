import Api from './Api.js'

export default {
  getGenre () {
    return Api().get('/genres')
  },
  getMembers (groupId) {
    return Api().get('/members?filter{"where":{"groupId":' + groupId + '}}')
  },
  addMember (groupId, userId, role, username) {
    return Api().post('/members', {
      creation_date: new Date(),
      groupId: groupId,
      userId: userId,
      role: role,
      username: username
    })
  },
  getMyCreatorGroups (creatorId) {
    return Api().get('/groups?filter{"where":{"creatorId":' + creatorId + '}}')
  },
  getMyGroups (userId) {
    return Api().get('/groups?filter{"where":{"member":[' + userId + ']}}')
    // {"where": { "member": ["5c2a3585e6618deca5f37c39"]}}
  },
  deleteMyGroup (groupId) {
    return Api().delete('/groups/' + groupId)
  },
  createGroup (name, genre, departement, commune, level, creatorId) {
    return Api().post('/groups', {
      name: name,
      genre: genre,
      creation_date: new Date(),
      country: 'fr',
      departement: departement,
      commune: commune,
      level: level,
      creatorId: creatorId
    })
  }
}
