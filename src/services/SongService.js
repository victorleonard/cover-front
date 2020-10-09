import Api from './Api.js'

export default {
  getSongs () {
    return Api().get('/selection')
  },
  searchOnSpotify (song) {
    return Api().get('/searches?song=' + song)
  },
  vote (value, songId, groupId, userId) {
    return Api().post('/votes', {
      vote: value,
      song: songId,
      group: groupId,
      user: userId
    })
  },
  selectSong (song, comment, groupId, userId) {
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
      comment: comment
    })
  }
}
