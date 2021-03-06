<template>
<div>
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
    </div>
  </q-card-section>
    <q-list class="q-pt-none">
      <q-item-label class="q-pa-md" style="width: 100%">
        <div class="row q-ma-xs justify-between" v-for="user in currentGroup.profiles" :key="user._id">
          <div class="col text-grey-9">{{ user.pseudo }}</div>
          <div class="col col-auto">
            <q-rating slot="subtitle" :value="getVote(song, user)" readonly :max="5" />
            <q-btn @click="$emit('displayComment', song, user)" v-if="getComment(song, user)" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
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
          <q-avatar v-if="getUserAvatar(song.created_by_id)" color="grey-7" text-color="white">
            <img :src="getUserAvatar(song.created_by_id)" alt="">
          </q-avatar>
          <q-avatar v-else color="grey-7" text-color="white" icon="fas fa-user-astronaut">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ getUserPseudo(song.created_by_id) }}</q-item-label>
        </q-item-section>
        <div v-if="song.spotify_preview_url">
          <audio :id="'audio-'+song._id" :src="song.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+song._id" @click="playMusic(song.spotify_preview_url, song._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+song._id" @click="pauseMusic(song.spotify_preview_url, song._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchDeezer(song)" flat icon="fab fa-deezer" size="md"></q-btn>
          <q-btn @click="launchSpotify(song.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <q-separator vertical/>
        <div>
          <q-btn label="Votez" no-caps dense @click="$emit('displayVoteDialog', song)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
        <!-- <div v-if="user.id === s.created_by_id">
          <q-btn @click="remove(s)" label="" flat color="negative" size="md" icon="ion-md-trash" />
        </div> -->
      </q-card-actions>
    </q-card>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SongCard',
  props: {
    song: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('main', ['currentGroup'])
  },
  methods: {
    getVote (song, user) {
      const vote = song.votes.find(v => v.user === user.user)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    },
    getComment (song, user) {
      const vote = song.votes.find(v => v.user === user.user)
      if (vote) {
        return vote.comment
      } else {
        return 0
      }
    },
    getUserAvatar (id) {
      const profile = this.currentGroup.profiles.find(p => p.user === id)
      if (profile && profile.avatar) {
        return profile.avatar.url
      }
    },
    getUserPseudo (id) {
      if (this.currentGroup.profiles.find(p => p.user === id)) {
        return this.currentGroup.profiles.find(p => p.user === id).pseudo
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
