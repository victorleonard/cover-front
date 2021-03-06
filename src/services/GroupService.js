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
  getGroup (groupId) {
    return Api().get('/groups/' + groupId)
  },
  getGroups () {
    return Api().get('/groups/')
  },
  getMyCreatorGroups (creatorId) {
    return Api().get('/groups?filter{"where":{"creatorId":' + creatorId + '}}')
  },
  getMyGroups (userId) {
    return Api().get('/groups?profiles.id=' + userId)
  },
  /* getMyGroups (userId) {
    return Api().get('/groups?filter{"where":{"member":[' + userId + ']}}')
    // {"where": { "member": ["5c2a3585e6618deca5f37c39"]}}
  }, */
  deleteMyGroup (groupId) {
    return Api().delete('/groups/' + groupId)
  },
  updateGroup (groupId, name, image, score) {
    return Api().put('/groups/' + groupId, {
      name: name,
      image: image,
      score: score
    })
  },
  createGroup (userId, name, commune, codeDepartement, codeRegion, image, country) {
    return Api().post('/groups', {
      users: [
        userId
      ],
      admin: userId,
      name: name,
      commune: commune,
      codeDepartement: codeDepartement,
      codeRegion: codeRegion,
      image: image,
      country: country
      /* genre: genre,
      country: 'fr',
      departement: departement,
      commune: commune,
      level: level,
      creatorId: creatorId */
    })
  },
  addGroupMember (groupId, users) {
    return Api().put('/groups/' + groupId, {
      users: users
    })
  }
}
