import Api from './Api.js'

export default {
  getSongs () {
    return Api().get('/selection')
  },
  searchOnSpotify (song) {
    return Api().get('/searches?song=' + song)
  },
  selectSong (song, groupId, userId) {
    return Api().post('/songs', {
      spotify_data: song,
      name: song.name,
      spotify_id: song.id,
      spotify_uri: song.uri,
      artist: song.artists[0].name,
      album: song.album.name,
      group: groupId,
      user: userId,
      images: song.album.images
    })
  }
}
