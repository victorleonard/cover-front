<template>
<div>
  <q-dialog v-model="dialog.video">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Modifier l'url youtube</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="song.youtube_id" autofocus/>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Annuler" no-caps v-close-popup />
        <q-btn flat label="Mettre à jour" no-caps v-close-popup @click="updateVideo" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="video" v-if="song.youtube_id" full-width>
      <q-video
      :ratio="16/9"
      :src="`https://www.youtube.com/embed/${song.youtube_id}?rel=0`"
    />
  </q-dialog>
  <q-dialog v-model="removeDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Voulez vous supprimer le titre "{{ song.name }}" ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Oui" unelevated color="negative" @click="remove" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-card>
  <q-card-section class="q-pa-none">
    <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
      <div class="col col-3 col-md-6">
        <img style="max-width: 100%; display: block" :src="song.images[0].url" alt="">
      </div>
      <div class="col q-pr-sm" style="line-height: 1.2rem">
          <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
          <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{song.artist}}</div>
      </div>
      <div v-if="userId === song.created_user_id" class="col-auto">
        <q-btn color="grey-7" round flat icon="eva-more-vertical-outline">
          <q-menu cover auto-close>
            <q-list>
              <!-- <q-item clickable>
                <q-item-section>Modifier mon vote</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Modifer mon commentaire</q-item-section>
              </q-item> -->
              <q-item clickable @click="dialog.video = true">
                <q-item-section avatar>
                  <q-icon color="negative" name="fab fa-youtube" />
                </q-item-section>
                <q-item-section>Modifer la vidéo youtube</q-item-section>
              </q-item>
              <q-item clickable @click="removeDialog = true">
                <q-item-section avatar>
                  <q-icon color="negative" name="eva-trash-2-outline" />
                </q-item-section>
                <q-item-section>Supprimer ce titre</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-card-section>
    <q-list class="q-pt-none">
      <q-item-label class="q-pa-md" style="width: 100%">
        <div class="row q-ma-xs justify-between" v-for="user in profiles" :key="user._id">
          <div class="col text-grey-9">{{ user.pseudo }}</div>
          <div class="col col-auto">
            <q-rating slot="subtitle" :value="getVote(song, user)" readonly :max="5" />
            <q-btn @click="displayComment(song, user)" v-if="getComment(song, user)" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="eva-info-outline" />
          </div>
        </div>
      </q-item-label>
    </q-list>
    <q-separator />
      <q-card-section v-if="song.comment">
        <q-icon class="text-grey-5" name="fas fa-quote-right" style="float: left; margin-right: 4px" />
        <div v-html="song.comment" class="text-grey-8" syle="font-style: italic; word-break: break-word;"></div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="around">
        <q-item-section avatar style="margin-right: -8px;">
          <q-avatar v-if="getUserAvatar(song.created_profile_id)" color="grey-7" text-color="white">
            <img :src="getUserAvatar(song.created_profile_id)" alt="">
          </q-avatar>
          <q-avatar v-else color="grey-7" text-color="white" icon="eva-person-outline">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ getUserPseudo(song.created_profile_id) }}</q-item-label>
        </q-item-section>
        <!-- <div v-if="song.spotify_preview_url">
          <audio :id="'audio-'+song._id" :src="song.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+song._id" @click="playMusic(song.spotify_preview_url, song._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+song._id" @click="pauseMusic(song.spotify_preview_url, song._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div> -->
        <div>
          <q-btn v-if="song.youtube_id" @click="video = true" flat icon="fab fa-youtube" color="negative" size="md"></q-btn>
          <q-btn flat @click="launchDeezer(song)">
            <q-avatar square size="md">
              <img src="~assets/deezer_logo.svg">
            </q-avatar>
          </q-btn>
          <q-btn @click="launchSpotify(song.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <q-separator vertical/>
        <div>
          <q-btn label="Votez" no-caps dense @click="$emit('displayVoteDialog', song)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
      </q-card-actions>
    </q-card>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SongCard',
  data: () => ({
    dialog: {
      video: false
    },
    removeDialog: false,
    video: false
  }),
  props: {
    song: {
      type: Object,
      default: () => {}
    },
    profiles: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('main', ['currentGroup']),
    userId () {
      return this.$q.cookies.get('user_id')
    }
  },
  methods: {
    extractYoutubeID (url) {
      var ID = ''
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_-]/i)
        ID = ID[0]
      } else {
        return ''
      }
      return ID
    },
    updateVideo () {
      if (!this.extractYoutubeID(this.song.youtube_id)) {
        this.$q.notify({
          type: 'negative',
          message: 'Le lien youtube n est pas correct',
          position: 'top'
        })
        return
      }
      this.$axios.put(`songs/${this.song.id}`, {
        youtube_id: this.extractYoutubeID(this.song.youtube_id)
      })
        .then(() => {
          this.$emit('loadSongs')
        })
    },
    displayComment (song, user) {
      const vote = song.votes.find(v => v.user === user.user.id)
      this.$q.notify({
        color: 'grey-9',
        message: `${user.pseudo} - ${this.song.name}`,
        caption: vote.comment,
        actions: [{ icon: 'close', color: 'white' }],
        position: 'top',
        avatar: this.getUserAvatar(user.id)
      })
    },
    getComment (song, user) {
      const vote = song.votes.find(v => v.user === user.user.id)
      if (vote && vote.comment) {
        return vote.comment
      } else {
        return 0
      }
    },
    remove () {
      this.$axios.delete('songs/' + this.song.id)
        .then(() => {
          this.$emit('loadSongs')
          this.$q.notify('Le titre a été supprimé')
        })
    },
    getVote (song, user) {
      const vote = song.votes.find(v => v.user === user.user.id)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    },
    getUserAvatar (id) {
      const profile = this.profiles.find(p => p.id === id)
      if (profile && profile.avatar) {
        return profile.avatar.url
      }
    },
    getUserPseudo (id) {
      if (this.currentGroup.profiles.find(p => p.id === id)) {
        return this.currentGroup.profiles.find(p => p.id === id).pseudo
      }
    },
    playMusic (track, id) {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelectorAll('.pause').forEach(el => {
        el.classList.add('hide')
      })
      document.querySelectorAll('.play').forEach(el => {
        el.classList.remove('hide')
      })
      document.querySelector('#audio-' + id).play()
      document.querySelector('#play-' + id).classList.add('hide')
      document.querySelector('#pause-' + id).classList.remove('hide')
    },
    pauseMusic (track, id) {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelector('#audio-' + id).pause()
      document.querySelector('#play-' + id).classList.remove('hide')
      document.querySelector('#pause-' + id).classList.add('hide')
    },
    launchSpotify (id) {
      location.href = id
    },
    launchDeezer (s) {
      this.$store.dispatch('main/searchOnSpotify', {
        song: s.name + ' ' + s.artist,
        plateform: 'deezer'
      })
        .then(r => {
          if (r.data[0]) {
            location.href = 'deezer://www.deezer.com/track/' + r.data[0].id
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Ce titre n\'a pas été trouvé sur Deezer',
              position: 'top'
            })
          }
        })
    }
  }
}
</script>
