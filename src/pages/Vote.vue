<template>
  <q-page class="bg-grey-3" v-if="currentGroup && currentGroup.songs.length" padding>
    <q-pull-to-refresh :handler="refresh">
      <q-dialog class="modal" minimized v-model="opened">
      <q-card>
        <q-card-section>
          <p class="text-center q-mb-none">Vote</p>
        </q-card-section>
        <q-card-section>
            <q-rating
              v-model="ratingModel"
              size="30px"
              :max="5"
            />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
          :disable='!ratingModel'
          color="primary"
          @click="vote"
          label="Vote"
        />
        </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- update vote -->
    <q-dialog class="modal" minimized v-model="updateOpened">
      <q-card class="q-px-sm q-pb-md">
      <p class="text-center" style="margin-top: 20px">Modifier le vote</p>
    <div class="modal-rate">
      <q-rating
        v-model="ratingModel"
        size="30px"
        :max="5"
      />
    </div>
    <div class="modal-rate">
      <q-btn
        :disable='!ratingModel'
        color="primary"
        @click="updateVote"
        label="Vote"
      />
      </div>
      </q-card>
    </q-dialog>
    <!--<q-list v-if="!noSelection.length">
      <h3 style="text-align: center">Pas de vote en cours</h3>
    </q-list>
    -->

    <!--//////////// -->
    <!-- awaitingVote -->
    <!--//////////// -->
    <div v-if="awaitingVote && awaitingVote.length">
    <div class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Titres en attente de ton vote :</div>
      <hr>
    </div>
    <div>
    <q-card v-for="s in awaitingVote" :key="s._id" class="q-ml-sm q-mr-sm q-mb-lg">
      <q-card-section class="q-pa-none">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block" :src="s.images[0].url" alt="">
            </div>
            <div class="col" style="line-height: 1.2rem">
                <div class="text-grey-9 q-title q-ml-sm">{{ s.name }}</div>
                <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{s.artist}}</div>
            </div>
          </div>
        </q-card-section>
      <q-list class="q-pt-none">
          <q-item-label class="q-pa-md" style="width: 100%">
            <div class="row q-ma-xs justify-between" v-for="user in currentGroup.users" :key="user._id">
              <div class="col text-grey-9">{{ user.username }}</div>
              <div class="col col-auto">
                <q-rating slot="subtitle" :value="getVote(s.votes, user.id)" readonly :max="5" />
              </div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-sm" v-if="s.comment">Commentaire :
              <div v-html="s.comment" syle="word-break: break-word;"></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-md" style="font-size: 12px">Proposé le {{ formatDate(s.createdAt) }} par {{ s.created_by }}</div>
          </q-item-label>
      </q-list>
      <q-separator />
      <q-card-actions align="around">
        <div v-if="s.spotify_preview_url">
          <audio :id="'audio-'+s._id" :src="s.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.spotify_preview_url, s._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchSpotify(s.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <div>
          <q-btn label="Votez" @click="showModal(s)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
        <div>
          <q-btn @click="remove(s)" label="" flat color="negative" size="md" icon="ion-md-trash" />
        </div>
      </q-card-actions>
    </q-card>
    </div>
    </div>

    <!--//////////// -->
    <!-- alreadyVote -->
    <!--/////////////-->
    <div v-if="alreadyVote.length">
    <div class="q-mt-xl q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Tu as déjà voté pour les titres suivants :</div>
      <hr>
    </div>
    <q-card v-for="s in alreadyVote" :key="s._id" class="q-ml-sm q-mr-sm q-mb-lg">
      <q-card-section class="q-pa-none">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block" :src="s.images[0].url" alt="">
            </div>
            <div class="col" style="line-height: 1.2rem">
                <div class="text-grey-9 q-title q-ml-sm">{{ s.name }}</div>
                <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{s.artist}}</div>
            </div>
          </div>
        </q-card-section>
      <q-list class="q-pt-none">
          <q-item-label class="q-pa-md" style="width: 100%">
            <div class="row q-ma-xs justify-between" v-for="user in currentGroup.users" :key="user._id">
              <div class="col text-grey-9">{{ user.username }}</div>
              <div class="col col-auto">
                <q-rating slot="subtitle" :value="getVote(s.votes, user.id)" readonly :max="5" />
              </div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-sm" v-if="s.comment">Commentaire :
              <div v-html="s.comment" syle="word-break: break-word;"></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-md" style="font-size: 12px">Proposé le {{ formatDate(s.createdAt) }} par {{ s.created_by }}</div>
          </q-item-label>
      </q-list>
      <q-separator />
      <q-card-actions align="around">
       <div v-if="s.spotify_preview_url">
          <audio :id="'audio-'+s._id" :src="s.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.spotify_preview_url, s._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchSpotify(s.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <div>
          <q-btn  label="Votez" @click="showUpdateModal(s)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
        <div>
          <q-btn @click="remove(s)" label="" flat color="negative" size="md" icon="ion-md-trash" />
        </div>
      </q-card-actions>
    </q-card>
    </div>
    <div v-else>
    <div class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Aucun vote en cours</div>
    </div>
    </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import Api from '../services/Api'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'vote',
  data () {
    return {
      songSelect: false,
      ratingModel: 0,
      trackSelected: undefined,
      opened: false,
      updateOpened: false,
      rating: {}
    }
  },
  computed: {
    ...mapState('main', ['currentGroup', 'user']),
    noSelection () {
      const result = []
      this.currentGroup.songs.forEach(selection => {
        if (selection.votes.length < this.currentGroup.users.length) {
          result.push(selection)
        }
      })
      return result
    },
    alreadyVote () {
      const result = []
      this.currentGroup.songs.forEach(selection => {
        if (selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    },
    awaitingVote () {
      const result = []
      this.currentGroup.songs.forEach(selection => {
        if (!selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    }
  },
  methods: {
    remove (track) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Voulez vous supprimer ce titre ?',
        ok: 'Oui',
        cancel: 'Non'
      }).then(() => {
        Api().delete('track/' + track._id)
          .then(resp => {
            this.$store.dispatch('main/loadSongs', false)
            // this.$q.notify('Le titre a été supprimé')
          })
      }).catch(() => {
        // this.$q.notify('Opération annulé')
      })
    },
    refresh (done) {
      Api().get('selection')
        .then(resp => {
          this.$store.dispatch('main/loadSongs', false)
          done()
        })
    },
    launchSpotify (id) {
      location.href = id
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
    formatDate (date) {
      return moment(date).lang('fr').format('L')
    },
    veto () {
      const userId = localStorage.getItem('userId')
      if (userId) {
        Api().put('vote/' + this.trackSelected._id, {
          value: 0,
          userId: userId
        })
          .then(resp => {
            this.openedVeto = false
            this.$q.notify({
              type: 'positive',
              message: 'Le titre a été retiré',
              position: 'top'
            })
            this.$store.dispatch('main/loadSongs', false)
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'êtes pas connecté. Veuillez relancer l\'application',
          position: 'top'
        })
      }
    },
    showVetoModal (track) {
      this.openedVeto = true
      this.ratingModel = 0
      this.trackSelected = track
    },
    showModal (track) {
      this.opened = true
      this.ratingModel = 0
      this.trackSelected = track
    },
    showUpdateModal (track) {
      this.updateOpened = true
      this.ratingModel = 0
      this.trackSelected = track
    },
    showVoteBtn (track) {
      if (track && track.vote) {
        const userId = localStorage.getItem('userId')
        const findVote = track.vote.find(el => {
          return el.userId === userId
        })
        if (findVote) {
          return false
        } else {
          return true
        }
      }
    },
    getUserName (userId) {
      const userName = this.users.find(user => user._id === userId)
      if (userName) {
        return userName.name
      }
    },
    getVote (votes, userId) {
      const vote = votes.find(v => v.created_by_id === userId)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    },
    vote () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/vote', {
        value: this.ratingModel,
        songId: this.trackSelected.id
      })
        .then((r) => {
          this.$store.dispatch('main/getCurrentGroup', {
            groupId: this.$route.params.groupId
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.opened = false
              this.$q.notify({
                type: 'positive',
                message: 'Le vote a bien été pris en compte',
                position: 'top'
              })
            })
        })
      /* const userId = localStorage.getItem('userId')
      if (userId) {
        Api().put('vote/' + this.trackSelected._id, {
          value: this.ratingModel,
          userId: userId
        })
          .then(resp => {
            this.opened = false
            this.$q.notify({
              type: 'positive',
              message: 'Le vote a bien été pris en compte',
              position: 'top'
            })
            this.$store.dispatch('main/loadSongs', false)
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'êtes pas connecté. Veuillez relancer l\'application',
          position: 'top'
        })
      } */
    },
    updateVote () {
      /* const userId = localStorage.getItem('userId')
      const selection = this.songsList.find(sel => sel._id === this.trackSelected._id)
      const vote = selection.vote.find(v => v.userId === userId)
      vote.value = this.ratingModel
      if (userId) {
        Api().put('vote/' + this.trackSelected._id + '/update', selection.vote)
          .then(resp => {
            this.updateOpened = false
            this.$q.notify({
              type: 'positive',
              message: 'Le vote a bien été mise à jour',
              position: 'top'
            })
            this.$store.dispatch('main/loadSongs', false)
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'êtes pas connecté. Veuillez relancer l\'application',
          position: 'top'
        })
      } */
    }
  },
  mounted () {
    /* let silentLoading
    if (this.songsList && this.songsList.length) {
      silentLoading = true
    } else {
      silentLoading = false
    } */
  }
}
</script>

<style lang="scss" scoped>
// @import '~variables';

.list-header {
  color: $primary;
}
.q-list-striped > .q-item:nth-child(even) {
  background-color: rgba(189,189,189,0.2);
}
  table,thead,tbody,tfoot,tr,th,td {
    width: auto;
    height: auto;
    margin: 0;
    padding: 3px 0px;
    border: none;
    border-collapse: inherit;
    border-spacing: 0;
    border-color: inherit;
    vertical-align: inherit;
    text-align: left;
    font-weight: inherit;
    -webkit-border-horizontal-spacing: 0;
    -webkit-border-vertical-spacing: 0;
}
.modal h4 {
  text-align : center;
  margin: 10px;
}
.modal .modal-rate {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.hide {
    display: none;
  }
  .show {
    display: block;
  }
</style>
