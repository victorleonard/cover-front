import Api from './Api.js'

export default {
  getSongs () {
    return Api().get('/selection')
  },
  getGroupSongs (groupId) {
    return Api().get('/songs?group=' + groupId + '&status_ne=refuse')
  },
  getRefuseGroupSongs (groupId) {
    return Api().get('/songs?group=' + groupId + '&status=refuse')
  },
  searchOnSpotify (song, plateform) {
    return Api().get('/searches?song=' + song + '&plateform=' + plateform)
  },
  vote (value, songId, groupId, userId, comment) {
    return Api().post('/votes', {
      vote: value,
      song: songId,
      group: groupId,
      user: userId,
      comment: comment
    })
  },
  updateVote (voteId, value, comment) {
    console.log('update vote !')
    return Api().put('/votes/' + voteId, {
      vote: value,
      comment: comment
    })
  },
  updateLevel (voteId, value) {
    return Api().put('/votes/' + voteId, {
      level: value
    })
  },
  selectSong (song, comment, groupId, userId, youtubeId) {
    return Api().post('/songs', {
      spotify_data: song,
      name: song.name,
      spotify_id: song.id,
      spotify_uri: song.uri,
      artist: song.artists[0].name,
      album: song.album.name,
      group: groupId,
      user: userId,
      images: song.album.images,
      comment: comment,
      spotify_preview_url: song.preview_url,
      youtube_id: youtubeId
    })
  }
}
