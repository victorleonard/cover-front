<template>
  <q-page v-if="currentGroup" padding class="search-page q-pl-md q-pr-md">
    <!-- set or update level -->
    <q-dialog class="modal" minimized v-model="levelModal">
      <q-card>
        <q-card-section>
          <p class="text-h6 q-mb-none">Quel est ton niveau sur ce titre ?</p>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <q-rating
              icon="fas fa-music"
              color="light-blue-8"
              v-model="levelModel"
              size="40px"
              :max="3"
            />
            <q-separator class="q-mt-md" />
              <ul class="text-subtitle1 text-weight-light">
                <li>O : pas commencé</li>
                <li>1: je dechiffre</li>
                <li>2: c'est bon j'ai la structure, je maitrise techniquement le morceau mais c'est pas hyper fluide</li>
                <li>3: I am God</li>
              </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
          :disable='!levelModel'
          color="primary"
          @click="updateLevel"
          label="Mettre à jour"
        />
        </q-card-actions>
        </q-card>
    </q-dialog>

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
    <!-- update vote -->
    <q-dialog class="modal" minimized v-model="updateOpened">
      <q-card>
        <q-card-section>
          <p class="text-center q-mb-none">Modifier le vote</p>
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
          @click="updateVote"
          label="Vote"
        />
        </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">Titres selectionnés</div>
      <div class="q-caption text-grey-10">( > {{ average }} points )</div>
      <hr>
    </div>
    <CardResult
      :level="true"
      coverSize="80px"
      @displayComment="displayComment"
      @showLevelModal="showLevelModal"
      @showUpdateModal="showUpdateModal"
      :song="s"
      v-for="s in allVoteOk"
      :key="s.id"
    />

    <!-- Morceaux refusés -->
    <div class="q-mt-xl q-pb-md q-pt-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres refusés</div>
      <hr>
    </div>
    <CardResult
      :level="false"
      coverSize="64px"
      @displayComment="displayComment"
      @showLevelModal="showLevelModal"
      @showUpdateModal="showUpdateModal"
      :song="s"
      v-for="s in allVoteKo"
      :key="s.id"
    />
  </q-page>
</template>

<script>

import { mapState } from 'vuex'
import moment from 'moment'
import orderBy from 'lodash/orderBy'
import CardResult from './../components/CardResult'

export default {
  name: 'TrackList',
  components: { CardResult },
  data () {
    return {
      levelModal: undefined,
      levelModel: undefined,
      ratingModel: undefined,
      updateOpened: false,
      trackSelected: undefined,
      selections: [],
      rating: {
        muse: 1
      },
      commentTempUser: '',
      commentTemp: '',
      commentDialog: false
    }
  },
  computed: {
    ...mapState('main', ['user', 'currentGroup', 'currentGroupSongs']),
    average () {
      return parseInt((this.currentGroup.profiles.length * 5) / 1.3)
    },
    allVoteOk () {
      const result = []
      this.currentGroupSongs.forEach(el => {
        if (el.votes.length && el.votes.length === this.currentGroup.profiles.length) {
          let total = 0
          el.votes.forEach(vote => {
            total += vote.vote
          })
          if (total > this.average) {
            el.total = total
            result.push(el)
          }
        }
      })
      return orderBy(result, ['total'], ['desc'])
    },
    allVoteKo () {
      const result = []
      this.currentGroupSongs.forEach(el => {
        if (el.votes.length && el.votes.length === this.currentGroup.profiles.length) {
          let total = 0
          el.votes.forEach(vote => {
            total += vote.vote
          })
          if (total <= this.average) {
            el.total = total
            result.push(el)
          }
          /* const total = el.votes.reduce((tot, num) => {
            return (tot.vote || tot) + num.vote
          }) */
        }
      })
      return orderBy(result, ['total'], ['desc'])
    }
  },
  methods: {
    getLevelAverage (votes) {
      const maxTotal = votes.length * 3
      let total = 0
      votes.forEach(v => {
        if (v.level) {
          total += v.level
        }
      })
      return total / maxTotal
    },
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
    displayComment (vote) {
      this.commentTempUser = vote.created_by
      this.commentTemp = vote.comment
      this.commentDialog = true
    },
    getVote (song) {
      const vote = song.votes.find(v => v.profile === this.user.profile)
      return vote.vote
    },
    getTotal (votes) {
      let total = 0
      votes.forEach(vote => {
        total += vote.vote
      })
      return total
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
    showLevelModal (track) {
      this.levelModal = true
      this.levelModel = 1
      this.trackSelected = track
    },
    showUpdateModal (track) {
      this.updateOpened = true
      this.ratingModel = 1
      this.trackSelected = track
    },
    updateLevel () {
      this.$store.dispatch('main/changeLoadingState', true)
      const vote = this.trackSelected.votes.find(v => v.created_by_id === this.user.id)
      this.$store.dispatch('main/updateLevel', {
        voteId: vote.id,
        value: this.levelModel
      })
        .then(r => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.levelModal = false
              this.$q.notify({
                type: 'positive',
                message: 'Le niveau a bien été mise à jour',
                position: 'top'
              })
            })
        })
    },
    updateVote () {
      this.$store.dispatch('main/changeLoadingState', true)
      const vote = this.trackSelected.votes.find(v => v.created_by_id === this.user.id)
      this.$store.dispatch('main/updateVote', {
        voteId: vote.id,
        value: this.ratingModel
      })
        .then(r => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.updateOpened = false
              this.$q.notify({
                type: 'positive',
                message: 'Le vote a bien été mise à jour',
                position: 'top'
              })
            })
        })
    },
    checkIfUserIsLogged () {
      if (!localStorage.getItem('userId')) {
        this.$router.push({
          name: 'home'
        })
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
    getAverage (votes) {
      let total = 0
      votes.forEach(v => {
        total += v.value
      })
      return total / votes.length
    },
    formatDate (date) {
      return moment(date).lang('fr').format('L')
    },
    getUserName (userId) {
      if (this.users) {
        const userName = this.users.find(user => user._id === userId)
        if (userName) {
          return userName.name
        }
      }
    }
  },
  mounted () {
    /* this.checkIfUserIsLogged()
    let silentLoading
    if (this.songsList && this.songsList.length) {
      silentLoading = true
    } else {
      silentLoading = false
    }
    this.$store.dispatch('main/loadSongs', silentLoading)
    this.$store.dispatch('main/loadUsers') */
  }
}
</script>

<style scoped>
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
  .modal .modal-rate {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }
</style>
