<template>
  <q-page padding class="search-page q-pl-md q-pr-md">
    <!-- DIALOG selection -->
    <q-dialog v-model="songSelectDialog">
      <q-card class="my-card" v-if="songSelected" style="width: 70vw">
        <q-img :src="songSelected.album.images[0].url" />

        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="text-h6">
              {{ songSelected.name }}
            </div>
          </div>
          <div class="text-caption text-grey q-mb-sm">{{ songSelected.artists[0].name }}</div>

          <q-rating v-model="ratingModel" :max="5" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-editor v-model="comment" :toolbar="[
        ['bold', 'italic', 'underline']
      ]" min-height="5rem" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" label="Choisir" @click="select" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-input v-model="search" :debounce="600" placeholder="Recherche par artiste, album, titre..." @input="searchSpotify" /> -->
    <q-input class="search" :debounce="600" @input="searchSpotify" v-model="search" placeholder="Recherche par artiste, album, titre...">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon v-if="search.length" name="close" @click="search = ''" class="cursor-pointer" />
        </template>
      </q-input>
    <div class="q-mt-md">
      <q-spinner-puff class="spinner" v-if="search.length && loading" color="secondary" :size="50" />
      <q-list v-if="searchResult.length">
        <q-expansion-item v-for="res in searchResult" :key="res.id" class="shadow-1 q-mb-md">
        <template v-slot:header style="padding: 0">
          <q-item-section avatar>
            <q-avatar square size="80px">
              <img :src="res.album.images[1].url" alt="">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{res.name}}</q-item-label>
            <q-item-label>{{res.artists[0].name}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <q-card-actions align="around">
            <q-btn flat icon="fab fa-spotify" @click="launchSpotify(res.uri)" size="md" color="positive"></q-btn>
            <q-btn class="btn-audio btn-audio-play" :id="'btn-audio-play-'+res.id" v-if="res.preview_url" flat color="primary" label="" icon="ion-md-play" size="md" @click="play(res.id)" />
            <q-btn class="btn-audio btn-audio-pause" :id="'btn-audio-pause-'+res.id" v-if="res.preview_url" flat color="primary" label="" icon="ion-md-pause" size="md" @click="pause(res.id)" />
            <q-btn flat color="primary" label="Choisir" icon="ion-md-add-circle" size="md" @click="displaySelectDialog(res)" />
            <audio :src="res.preview_url" :id="'audio-' + res.id" type="audio/mpeg"></audio>
          </q-card-actions>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'search',
  data () {
    return {
      comment: '',
      songSelectDialog: false,
      songSelected: undefined,
      search: '',
      ratingModel: 1,
      searchResult: [],
      token: '',
      loading: false
    }
  },
  computed: {
    ...mapState('main', ['currentGroupSongs'])
  },
  methods: {
    launchSpotify (id) {
      location.href = id
    },
    allPause () {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelectorAll('.btn-audio.btn-audio-pause').forEach(el => {
        el.style.display = 'none'
      })
      document.querySelectorAll('.btn-audio.btn-audio-play').forEach(el => {
        el.style.display = 'inline-block'
      })
    },
    play (id) {
      this.allPause()
      const audioToPlay = document.querySelector('#audio-' + id)
      const btnActionPlay = document.querySelector('#btn-audio-play-' + id)
      const btnActionPause = document.querySelector('#btn-audio-pause-' + id)
      btnActionPlay.style.display = 'none'
      btnActionPause.style.display = 'inline-block'
      audioToPlay.play()
    },
    pause (id) {
      const audioToPlay = document.querySelector('#audio-' + id)
      const btnActionPlay = document.querySelector('#btn-audio-play-' + id)
      const btnActionPause = document.querySelector('#btn-audio-pause-' + id)
      btnActionPause.style.display = 'none'
      btnActionPlay.style.display = 'inline-block'
      audioToPlay.pause()
    },
    displaySelectDialog (t) {
      if (this.currentGroupSongs.find(s => s.spotify_id === t.id)) {
        this.$q.notify({
          type: 'negative',
          message: 'Ce titre a déjà été séléctioné',
          position: 'top'
        })
      } else {
        this.songSelected = t
        this.songSelectDialog = true
      }
    },
    select () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/selectSong', {
        song: this.songSelected,
        comment: this.comment
      })
        .then(song => {
          console.log('song', song)
          this.$store.dispatch('main/vote', {
            value: this.ratingModel,
            songId: song.data.id
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.$store.dispatch('main/getCurrentGroupSongs', {
                groupId: this.$route.params.groupId
              })
              this.songSelectDialog = false
              this.comment = ''
              this.ratingModel = 1
              this.$q.notify({
                type: 'positive',
                message: 'Titre séléctioné !',
                position: 'top'
              })
            })
            .catch(error => {
              console.error('error =>', error)
              this.$store.dispatch('main/changeLoadingState', false)
              this.$q.notify({
                type: 'negative',
                message: 'Titre selectionné mais vote non pris en compte.',
                position: 'top'
              })
            })
        })
        .catch(error => {
          console.error('error =>', error)
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'negative',
            message: 'Une erreur est survenue. Veuillez ressayer plus tard',
            position: 'top'
          })
        })
      /* const userId = localStorage.getItem('userId')
      Api().post('/add_track', {
        track: t,
        userId: userId
      })
        .then(resp => {
          this.$store.dispatch('main/loadSongs', true)
          this.$q.notify({
            type: 'positive',
            message: 'Morceau séléctioné !',
            position: 'top'
          })
        }) */
    },
    searchSpotify () {
      this.searchResult = []
      this.loading = true
      if (this.search.length) {
        this.$store.dispatch('main/searchOnSpotify', {
          song: this.search,
          plateform: 'spotify'
        })
          .then(r => {
            this.loading = false
            this.searchResult = r.data.tracks.items
          })
      }
    }
  }
}
</script>

<style scoped>
  .btn-audio.btn-audio-pause {
    display: none;
  }
  .spinner {
    left: 0;
    right: 0;
    margin-top: 20px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
  }
</style>
