<template>
<q-expansion-item class="shadow-1 q-mb-md">
  <template v-slot:header style="padding: 0">
    <q-item-section avatar>
      <q-avatar square :size="coverSize">
        <img :src="song.images[0].url">
      </q-avatar>
      <div class="absolute q-item-letter">
        {{ getTotal(song.votes) }}
        <q-icon name="star" color="grey-4" />
      </div>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium text-subtitle1">{{song.name}}</q-item-label>
      <q-item-label>{{song.artist}}</q-item-label>
      <q-linear-progress v-if="level" class="absolute" style="bottom: 0; left:0"
      :value="getLevelAverage(song.votes)" />
    </q-item-section>
  </template>

  <q-card>
    <q-card-section>
      <q-list>
          <q-item-label v-if="song.votes.length" style="width: 100%">
            <div class="row q-ma-xs justify-between" v-for="vote in song.votes" :key="vote._id">
              <div class="col text-grey-9">{{ getUserPseudo(vote.user) }}</div>
              <div class="col col-auto q-mr-xl" >
                <q-rating v-if="level" slot="subtitle" icon="fas fa-music" color="light-blue-8" :value="vote.level ? vote.level : 0" readonly :max="3" />
              </div>
              <div class="col col-auto" >
                <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                <q-btn @click="$emit('displayComment', vote)" v-if="vote.comment" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
              </div>
            </div>
          </q-item-label>
      </q-list>
    </q-card-section>
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
        <q-btn class="play" :id="'play-'+song._id" @click="playMusic(song.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
        <q-btn class="pause hide" :id="'pause-'+song._id" @click="pauseMusic(song.spotify_preview_url, song._id)" color="primary" flat size="md" icon="ion-md-pause" />
      </div>
      <div>
        <q-btn @click="launchDeezer(song)" flat icon="fab fa-deezer" size="md"></q-btn>
        <q-btn @click="launchSpotify(song.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
      </div>
      <q-separator vertical/>
      <div>
        <q-btn @click="$emit('showUpdateModal', song)" flat color="yellow-10" size="md" icon="how_to_vote" />
      </div>
      <div v-if="level">
        <q-btn @click="$emit('showLevelModal', song)" flat color="light-blue-8" size="md" icon="fas fa-music" />
      </div>
    </q-card-actions>
  </q-card>
</q-expansion-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SongCardResult',
  props: {
    level: {
      type: Boolean,
      default: false
    },
    coverSize: {
      type: String,
      default: '80px'
    },
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
      const vote = song.votes.find(v => v.profile_id === user.id)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    },
    getComment (song, user) {
      const vote = song.votes.find(v => v.profile_id === user.id)
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
    },
    getTotal (votes) {
      let total = 0
      votes.forEach(vote => {
        total += vote.vote
      })
      return total
    },
    getLevelAverage (votes) {
      const maxTotal = votes.length * 3
      let total = 0
      votes.forEach(v => {
        if (v.level) {
          total += v.level
        }
      })
      return total / maxTotal
    }
  }
}
</script>
