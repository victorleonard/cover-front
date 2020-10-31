<template>
  <q-page class="bg-grey-3" v-if="currentGroup" padding>
      <q-dialog
        v-model="commentDialog"
      >
      <q-card style="width: 60vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ commentTempUser }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-html="commentTemp">
        </q-card-section>
      </q-card>
    </q-dialog>
      <!-- DIALOG selection -->
      <q-dialog v-model="voteDialog">
        <q-card class="my-card" v-if="songSelected" style="width: 70vw">
          <q-img :src="songSelected.images[0].url" />

          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="text-h6">
                {{ songSelected.name }}
              </div>
            </div>
            <div class="text-caption text-grey q-mb-sm">{{ songSelected.artist }}</div>

            <q-rating v-model="ratingModel" :max="5" size="32px" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-editor v-model="comment" :toolbar="[
          ['bold', 'italic', 'underline']
        ]" min-height="5rem" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Voter" @click="vote" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    <!-- update vote -->
    <!-- DIALOG selection -->
      <q-dialog v-model="voteDialogUpdate">
        <q-card class="my-card" v-if="songSelected" style="width: 70vw">
          <q-img :src="songSelected.images[0].url" />

          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="text-h6">
                {{ songSelected.name }}
              </div>
            </div>
            <div class="text-caption text-grey q-mb-sm">{{ songSelected.artist }}</div>

            <q-rating v-model="ratingModel" :max="5" size="32px" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-editor v-model="comment" :toolbar="[
          ['bold', 'italic', 'underline']
        ]" min-height="5rem" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Modifer mon vote" @click="updateVote" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    <!--//////////// -->
    <!-- awaitingVote -->
    <!--//////////// -->
    <div v-if="awaitingVote && awaitingVote.length">
    <div class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">Votes en attente</div>
      <hr>
    </div>
    <div>
      <div class="row">
        <div v-for="s in awaitingVote" :key="s._id" class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm">
    <q-card>
      <q-card-section class="q-pa-none">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block" :src="s.images[0].url" alt="">
            </div>
            <div class="col q-pr-sm" style="line-height: 1.2rem">
                <div class="text-grey-9 q-title q-ml-sm">{{ s.name }}</div>
                <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{s.artist}}</div>
            </div>
          </div>
        </q-card-section>
      <q-list class="q-pt-none">
          <q-item-label class="q-pa-md" style="width: 100%">
            <div class="row q-ma-xs justify-between" v-for="user in currentGroup.profiles" :key="user._id">
              <div class="col text-grey-9">{{ user.pseudo }}</div>
              <div class="col col-auto">
                <q-rating slot="subtitle" :value="getVote(s, user)" readonly :max="5" />
                <q-btn @click="displayComment(s, user)" v-if="getComment(s, user)" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
              </div>
            </div>
          </q-item-label>
      </q-list>
      <q-separator />
      <q-card-section v-if="s.comment">
        <q-icon class="text-grey-5" name="fas fa-quote-right" style="float: left; margin-right: 4px" />
        <div v-html="s.comment" class="text-grey-8" syle="font-style: italic; word-break: break-word;"></div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="around">
        <q-item-section avatar style="margin-right: -8px;">
          <q-avatar v-if="getUserAvatar(s.created_by_id)" color="grey-7" text-color="white">
            <img :src="getUserAvatar(s.created_by_id)" alt="">
          </q-avatar>
          <q-avatar v-else color="grey-7" text-color="white" icon="fas fa-user-astronaut">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ getUserPseudo(s.created_by_id) }}</q-item-label>
        </q-item-section>
        <div v-if="s.spotify_preview_url">
          <audio :id="'audio-'+s._id" :src="s.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.spotify_preview_url, s._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchDeezer(s)" flat icon="fab fa-deezer" size="md"></q-btn>
          <q-btn @click="launchSpotify(s.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <q-separator vertical/>
        <div>
          <q-btn label="Votez" no-caps dense @click="displayVoteDialog(s)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
        <div v-if="user.id === s.created_by_id">
          <q-btn @click="remove(s)" label="" flat color="negative" size="md" icon="ion-md-trash" />
        </div>
      </q-card-actions>
      </q-card>
      </div>
    </div>
    </div>
    </div>

    <!--//////////// -->
    <!-- alreadyVote -->
    <!--/////////////-->
    <div class="q-mt-xl" v-if="noSelection.length">
    <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">Votes effectués</div>
      <hr>
    </div>
    <div class="row">
        <div v-for="s in noSelection" :key="s._id" class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm">
    <q-card>
      <q-card-section class="q-pa-none">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-8">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block" :src="s.images[0].url" alt="">
            </div>
            <div class="col q-pr-sm" style="line-height: 1.2rem">
                <div class="text-white q-title q-ml-sm">{{ s.name }}</div>
                <div class="text-white q-subheading q-ml-sm q-mt-sm">{{s.artist}}</div>
            </div>
          </div>
        </q-card-section>
      <q-list class="q-pt-none">
          <q-item-label class="q-pa-md" style="width: 100%">
            <div class="row q-ma-xs q-pr-sm justify-between" v-for="user in currentGroup.profiles" :key="user._id">
              <div class="col text-grey-9">{{ user.pseudo }}</div>
              <div class="col col-auto" >
                <q-rating slot="subtitle" :value="getVote(s, user)" readonly :max="5" />
                <q-btn @click="displayComment(s, user)" v-if="getComment(s, user)" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
              </div>
            </div>
          </q-item-label>
      </q-list>
      <q-separator />
      <q-card-section v-if="s.comment">
        <q-icon class="text-grey-5" name="fas fa-quote-right" style="float: left; margin-right: 4px" />
        <div v-html="s.comment" class="text-grey-8" syle="font-style: italic; word-break: break-word;"></div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="around">
        <q-item-section avatar style="margin-right: -8px;">
          <q-avatar v-if="getUserAvatar(s.created_by_id)" color="grey-7" text-color="white">
            <img :src="getUserAvatar(s.created_by_id)" alt="">
          </q-avatar>
          <q-avatar v-else color="grey-7" text-color="white" icon="fas fa-user-astronaut">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ getUserPseudo(s.created_by_id) }}</q-item-label>
        </q-item-section>
       <div v-if="s.spotify_preview_url">
          <audio :id="'audio-'+s._id" :src="s.spotify_preview_url"></audio>
          <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.spotify_preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.spotify_preview_url, s._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchDeezer(s)" flat icon="fab fa-deezer" size="md"></q-btn>
          <q-btn @click="launchSpotify(s.spotify_uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <div>
          <q-btn @click="showUpdateModal(s)" flat color="yellow-10" size="md" icon="how_to_vote" />
        </div>
        <div v-if="user.id === s.created_by_id">
          <q-btn @click="remove(s)" label="" flat color="negative" size="md" icon="ion-md-trash" />
        </div>
      </q-card-actions>
    </q-card>
    </div>
    </div>
    </div>
    <div v-else>
    <div class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Aucun vote en cours</div>
    </div>
    </div>
  </q-page>
</template>

<script>
import Api from '../services/Api'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

export default {
  name: 'vote',
  data () {
    return {
      songSelected: undefined,
      songSelect: false,
      ratingModel: 0,
      trackSelected: undefined,
      voteDialog: false,
      comment: '',
      voteDialogUpdate: false,
      rating: {},
      commentTempUser: '',
      commentTemp: '',
      commentDialog: false
    }
  },
  computed: {
    ...mapState('main', ['currentGroup', 'user', 'currentGroupSongs']),
    ...mapGetters('main', ['awaitingVote']),
    currentGroupUser () {
      return orderBy(this.currentGroup.profiles, ['pseudo'], ['asc'])
    },
    noSelection () {
      const result = []
      this.currentGroupSongs.forEach(selection => {
        if ((selection.votes.length < this.currentGroup.profiles.length) && selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    },
    alreadyVote () {
      const result = []
      this.currentGroupSongs.forEach(selection => {
        if (selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    }
    /* awaitingVote () {
      const result = []
      this.currentGroup.songs.forEach(selection => {
        if (!selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    } */
  },
  methods: {
    getUserPseudo (id) {
      if (this.currentGroup.profiles.find(p => p.id === id)) {
        return this.currentGroup.profiles.find(p => p.id === id).pseudo
      }
    },
    getUserAvatar (id) {
      const profile = this.currentGroup.profiles.find(p => p.id === id)
      if (profile && profile.avatar) {
        return profile.avatar.url
      }
    },
    displayVoteDialog (t) {
      this.songSelected = t
      this.voteDialog = true
    },
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
      this.$store.dispatch('main/getCurrentGroup', {
        groupId: this.$route.params.groupId
      })
        .then(() => {
          done()
        })
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
            // window.open(r.data[0].link, '_blank')
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
    launchAppleMusic (s) {
      this.$store.dispatch('main/searchOnSpotify', {
        song: s.name + ' ' + s.artist,
        plateform: 'apple'
      })
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
      const vote = track.votes.find(vote => vote.created_by_id === this.user.id)
      this.voteDialogUpdate = true
      this.ratingModel = vote.vote
      this.songSelected = track
      this.comment = vote.comment ? vote.comment : ''
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
    getVote (song, user) {
      const vote = song.votes.find(v => v.profile_id === user.id)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    },
    /* getVote (votes, userId) {
      const vote = votes.find(v => v.created_by_id === userId)
      if (vote) {
        return vote.vote
      } else {
        return 0
      }
    }, */
    displayComment (song, user) {
      const vote = song.votes.find(v => v.profile_id === user.id)
      this.commentTempUser = vote.created_by
      this.commentTemp = vote.comment
      this.commentDialog = true
    },
    getComment (song, user) {
      const vote = song.votes.find(v => v.profile_id === user.id)
      if (vote) {
        return vote.comment
      } else {
        return 0
      }
    },
    vote () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/vote', {
        value: this.ratingModel,
        songId: this.songSelected.id,
        comment: this.comment
      })
        .then((r) => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.voteDialog = false
              this.comment = ''
              this.$q.notify({
                type: 'positive',
                message: 'Le vote a bien été pris en compte',
                position: 'top'
              })
            })
        })
    },
    updateVote () {
      this.$store.dispatch('main/changeLoadingState', true)
      const vote = this.songSelected.votes.find(vote => vote.created_by_id === this.user.id)
      this.$store.dispatch('main/updateVote', {
        voteId: vote.id,
        value: this.ratingModel,
        comment: this.comment
      })
        .then((r) => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.voteDialogUpdate = false
              this.comment = ''
              this.$q.notify({
                type: 'positive',
                message: 'Le vote a bien été modifié',
                position: 'top'
              })
            })
        })
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
    this.$store.dispatch('main/getCurrentGroupSongs', {
      groupId: this.$route.params.groupId
    })
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
