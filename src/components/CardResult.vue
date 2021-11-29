<template>
<div>
  <q-dialog v-model="video" v-if="song.youtube_id" full-width>
      <q-video
      :src="`https://www.youtube.com/embed/${song.youtube_id}?rel=0`"
    />
  </q-dialog>
<q-expansion-item class="shadow-1 q-mb-md">
  <template v-slot:header style="padding: 0">
    <q-item-section avatar>
      <q-avatar square :size="coverSize">
        <img :src="song.images[0].url" alt="">
      </q-avatar>
      <div class="absolute q-item-letter">
        {{ getTotal(song.votes) }}
        <q-icon name="eva-star-outline" color="grey-4" style="margin-bottom: .1rem"/>
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
              <div class="col text-grey-9">{{ getUserPseudoFromVote(vote.user) }}</div>
              <div class="col col-auto q-mr-xl" >
                <q-rating v-if="level" slot="subtitle" icon="eva-music-outline" color="light-blue-8" :value="vote.level ? vote.level : 0" readonly :max="3" />
              </div>
              <div class="col col-auto" >
                <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                <q-btn @click="displayComment(vote)" v-if="vote.comment" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="eva-info-outline" />
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
        <q-avatar v-if="getUserAvatar(song.created_user_id)" color="grey-7" text-color="white">
          <img :src="getUserAvatar(song.created_user_id)" alt="">
        </q-avatar>
        <q-avatar v-else color="grey-9" text-color="white" icon="eva-person-outline">
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ getUserPseudo(song.created_profile_id) }}</q-item-label>
      </q-item-section>
      <!-- <div v-if="song.spotify_preview_url">
        <audio :id="'audio-'+song._id" :src="song.spotify_preview_url"></audio>
        <q-btn class="play" :id="'play-'+song._id" @click="playMusic(song.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
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
      <!-- <div>
        <q-btn @click="$emit('showUpdateModal', song)" flat color="yellow-10" size="md" icon="how_to_vote" />
      </div> -->
      <!-- <div v-if="level">
        <q-btn @click="$emit('showLevelModal', song)" flat color="light-blue-8" size="md" icon="eva-music-outline" />
      </div> -->
      <q-separator vertical inset class="q-ml-sm"/>
        <!-- <q-btn @click="song.setlist ? removeToSetlist() : addToSetlist()" flat color="green-10" :icon="song.setlist ? 'eva-checkmark-square-2-outline' : 'eva-square-outline'" /> -->
        <q-btn color="grey-7" round flat icon="more_vert">
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable @click="$emit('showUpdateModal', song)">
                <q-item-section avatar>
                  <q-icon color="yellow-10" name="how_to_vote" />
                </q-item-section>
                <q-item-section>Modifier mon vote</q-item-section>
              </q-item>
              <q-item v-if="level" clickable @click="$emit('showLevelModal', song)">
                <q-item-section avatar>
                  <q-icon color="light-blue-8" name="eva-music-outline" />
                </q-item-section>
                <q-item-section>Modifer mon niveau</q-item-section>
              </q-item>
              <!-- <q-item clickable @click="song.setlist ? removeToSetlist() : addToSetlist()">
                <q-item-section avatar>
                  <q-icon color="green-10" name="eva-list-outline" />
                </q-item-section>
                <q-item-section>{{ song.setlist ? 'Retier de la setlist' : 'Ajouter à la setlist' }}</q-item-section>
              </q-item> -->
              <!-- <q-item clickable @click="removeDialog = true">
                <q-item-section>Suprimmer ce titre</q-item-section>
              </q-item> -->
            </q-list>
          </q-menu>
        </q-btn>
    </q-card-actions>
  </q-card>
</q-expansion-item>
</div>
</template>

<script>

export default {
  name: 'SongCardResult',
  data: () => ({
    video: false
  }),
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
    },
    profiles: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    addToSetlist () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`/songs/${this.song.id}`, {
        setlist: true
      })
        .then(() => {
          this.$emit('loadSongs')
          this.$q.notify({
            message: 'Le titre a été ajouté à la setlist',
            type: 'positive',
            position: 'top'
          })
        })
    },
    removeToSetlist () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`/songs/${this.song.id}`, {
        setlist: false
      })
        .then(() => {
          this.$q.notify({
            message: 'Le titre a été retiré de la setlist',
            type: 'positive',
            position: 'top'
          })
          this.$emit('loadSongs')
        })
    },
    displayComment (vote) {
      this.$q.notify({
        color: 'grey-9',
        message: `${this.song.name}`,
        caption: vote.comment,
        actions: [{ icon: 'close', color: 'white' }],
        position: 'top',
        avatar: this.getUserAvatar(vote.user)
      })
    },
    getUserAvatar (id) {
      const profile = this.profiles.find(p => p.user.id === id)
      if (profile && profile.avatar) {
        return profile.avatar.url
      }
    },
    getUserPseudo (id) {
      if (this.profiles.find(p => p.id === id)) {
        return this.profiles.find(p => p.id === id).pseudo
      }
    },
    getUserPseudoFromVote (id) {
      if (this.profiles.find(p => p.user.id === id)) {
        return this.profiles.find(p => p.user.id === id).pseudo
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
