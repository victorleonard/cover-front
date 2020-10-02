<template>
  <q-page style="bg-grey-3" padding class="search-page q-pl-md q-pr-md">
    <!-- update vote -->
    <q-dialog class="modal" minimized v-model="updateOpened">
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
    </q-dialog>

    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres selectionnés</div>
      <div class="q-caption text-grey-10">( > {{ average }} points )</div>
      <hr>
    </div>
    <q-list v-if="allVoteOk && allVoteOk.length">
        <q-collapsible class="shadow-1"
        v-for="s in allVoteOk" :key="s._id"
        :image="s.track.album.images[0].url"
        :label="s.track.name"
        :sublabel="s.track.artists[0].name"
        :right-letter="getTotal(s.total)">
        <q-list>
          <q-item>
            <q-item-main v-if="s.vote.length">
              <div class="row row items-center q-ma-xs" v-for="vote in s.vote" :key="vote.userId">
                <div class="col text-grey-9">{{ getUserName(vote.userId) }}</div>
                <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="vote.value" readonly :max="5" /></div>
              </div>
              <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</div>
            </q-item-main>
          </q-item>
        </q-list>
        <q-card-separator />
          <q-card-actions align="around">
            <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
            <q-btn @click="showUpdateModal(s)" flat icon="star_border" label="Voter" size="md" color="yellow-10"></q-btn>
          </q-card-actions>
        </q-collapsible>
      </q-list>

    <!-- Morceaux refusés -->
    <div class="q-mt-lg q-pb-md q-pt-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres refusés</div>
      <hr>
    </div>

    <q-list v-if="allVoteKo && allVoteKo.length">
        <q-collapsible class="shadow-1"
        v-for="s in allVoteKo" :key="s._id"
        :image="s.track.album.images[0].url"
        :label="s.track.name"
        :sublabel="s.track.artists[0].name"
        :right-letter="getTotal(s.total)">
        <q-list>
          <q-item>
            <q-item-main v-if="s.vote.length">
              <div class="row row items-center q-ma-xs" v-for="vote in s.vote" :key="vote.userId">
                <div class="col text-grey-9">{{ getUserName(vote.userId) }}</div>
                <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="vote.value" readonly :max="5" /></div>
              </div>
              <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</div>
            </q-item-main>
          </q-item>
        </q-list>
        <q-card-separator />
          <q-card-actions align="around">
            <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
            <q-btn @click="showUpdateModal(s)" flat icon="ion-md-star" label="Voter" size="md" color="yellow-10"></q-btn>
          </q-card-actions>
        </q-collapsible>
      </q-list>

    <!-- Morceaux refusés direct -->
    <div class="q-mt-lg q-pb-md q-pt-lg" >
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres refusés direct</div>
      <hr>
    </div>
    <q-list v-if="vetoVote && vetoVote.length">
        <q-collapsible class="shadow-1"
        v-for="s in vetoVote" :key="s._id"
        :image="s.track.album.images[0].url"
        :label="s.track.name"
        :sublabel="s.track.artists[0].name">
        <q-chip floating color="grey-8" style="top: -0px; right: -0em;border-radius: 0; border-top-right-radius: 3px;">{{s.total}} pts</q-chip>
        <q-list>
          <q-item>
            <q-item-main v-if="s.vote.length">
              <div class="row row items-center q-ma-xs" v-for="vote in s.vote" :key="vote.userId">
                <div class="col text-grey-9">{{ getUserName(vote.userId) }}</div>
                <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="vote.value" readonly :max="5" /></div>
              </div>
              <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</div>
            </q-item-main>
          </q-item>
        </q-list>
        <q-card-separator />
          <q-card-actions align="around">
            <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
            <q-btn @click="showUpdateModal(s)" flat icon="ion-md-star" label="Voter" size="md" color="yellow-10"></q-btn>
          </q-card-actions>
        </q-collapsible>
      </q-list>
    <!--<q-list highlight style="margin-top: 40px">
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">🖕</span>
      <span style="font-size: 1.2em"> Titres refusés direct !</span></q-list-header>
      <q-collapsible v-for="s in vetoVote" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
        <div class="row items-center">
          <div v-if="s.track.preview_url" class="col col-auto" style="margin: 0 auto">
            <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
            <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" push rounded color="primary" label="Play" icon="ion-md-play" />
            <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" push rounded color="primary" label="Pause" icon="ion-md-pause" />
            <br><br>
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <small>Album: <span>{{ s.track.album.name }}</span></small><br>
            <small>Ajouté le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</small><br>
            <q-rating slot="subtitle" :value="getAverage(s.vote)" readonly :max="5" />
            <br><br>
          </div>
        </div>

        <div class="row" v-if="s.vote.length">
          <div class="col q-pa-sm" v-for="vote in s.vote" :key="vote.userId">
          <div>{{ getUserName(vote.userId) }}</div>
            <q-rating slot="subtitle" :value="vote.value" readonly :max="5" />
          </div>
        </div>
      </q-collapsible>
    </q-list>-->
  </q-page>
</template>

<script>

import Api from '../services/Api'
import { QDialog } from 'quasar'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: { QDialog },
  name: 'playlist',
  data () {
    return {
      ratingModel: undefined,
      updateOpened: false,
      trackSelected: undefined,
      selections: [],
      rating: {
        muse: 1
      }
    }
  },
  computed: {
    ...mapState('main', ['songsList', 'users']),
    ...mapGetters('main', ['average', 'vetoVote', 'awaitingVote', 'allVote']),
    allVoteOk () {
      return ''
      /* if (this.allVote) {
        const els = []
        this.allVote.forEach(el => {
          if (!el.vote.find(v => v.value === 0)) {
            let total = 0
            el.vote.forEach(v => {
              total += v.value
            })
            el.total = total
            if (total >= this.average) {
              els.push(el)
            }
          }
        })
        return orderBy(els, ['total'], ['desc'])
      } */
    },
    allVoteKo () {
      return ''
      /* if (this.allVote) {
        const els = []
        this.allVote.forEach(el => {
          let total = 0
          el.vote.forEach(v => {
            total += v.value
          })
          if (total < this.average) {
            els.push(el)
          }
        })
        return orderBy(els, ['total'], ['desc'])
      } */
    }
  },
  methods: {
    getTotal (total) {
      console.log('total', total)
      if (total && total > 1) {
        return total.toString() + ' pts'
      }
    },
    launchSpotify (id) {
      location.href = id
    },
    showUpdateModal (track) {
      this.updateOpened = true
      this.ratingModel = undefined
      this.trackSelected = track
    },
    updateVote () {
      const userId = localStorage.getItem('userId')
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
            // this.getSelections()
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'êtes pas connecté. Veuillez relancer l\'application',
          position: 'top'
        })
      }
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
