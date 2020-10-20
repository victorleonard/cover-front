<template>
  <q-page v-if="currentGroup" padding class="search-page q-pl-md q-pr-md">
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
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres selectionnés</div>
      <div class="q-caption text-grey-10">( > {{ average }} points )</div>
      <hr>
    </div>
    <q-expansion-item v-for="s in allVoteOk" :key="s.id" class="shadow-1 q-mb-md">
        <template v-slot:header style="padding: 0">
          <q-item-section avatar>
            <q-avatar square size="80px">
              <img :src="s.images[0].url">
            </q-avatar>
            <div class="absolute q-item-letter">{{getTotal(s.votes)}} pts</div>
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{s.name}}</q-item-label>
            <q-item-label>{{s.artist}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <q-list>
                <q-item-label v-if="s.votes.length" style="width: 100%">
                  <div class="row q-ma-xs justify-between" v-for="vote in s.votes" :key="vote._id">
                    <div class="col text-grey-9">{{ vote.created_by }}</div>
                    <div class="col col-auto" >
                      <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                    </div>
                  </div>
                  <div class="text-grey-6 q-caption q-ml-xs q-mt-sm" v-if="s.comment">Commentaire :
              <div v-html="s.comment" syle="word-break: break-word;"></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-md" style="font-size: 12px">Proposé le {{ formatDate(s.createdAt) }} par {{ s.created_by }}</div>
                </q-item-label>
            </q-list>
            <q-separator class="q-mt-sm"/>
            <q-card-actions align="around" class="q-mb-none q-pb-none">
              <q-btn @click="launchDeezer(s)" flat icon="fab fa-deezer" size="md"></q-btn>
              <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
              <q-btn @click="showUpdateModal(s)" flat icon="star_border" label="Voter" size="md" color="yellow-10"></q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    <!-- <q-list v-if="allVoteOk && allVoteOk.length">
        <q-expansion-item class="shadow-1"
        v-for="s in allVoteOk" :key="s._id"
        :image="s.images[0].url"
        :label="s.name"
        :sublabel="s.artist"
        :right-letter="getTotal(s.total)">
        <q-list>
          <q-item>
            <q-item-label v-if="s.votes.length">
              <div class="row row items-center q-ma-xs" v-for="user in currentGroup.users" :key="user._id">
              <div class="col text-grey-9">{{ user.username }}</div>
              <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="getVote(s)" readonly :max="5" /></div>
            </div>
              <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.createdAt) }} par {{ getUserName(s.profile) }}</div>
            </q-item-label>
          </q-item>
        </q-list>
        <q-separator />
          <q-card-actions align="around">
            <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
            <q-btn @click="showUpdateModal(s)" flat icon="star_border" label="Voter" size="md" color="yellow-10"></q-btn>
          </q-card-actions>
        </q-expansion-item>
      </q-list> -->

    <!-- Morceaux refusés -->
    <div class="q-mt-lg q-pb-md q-pt-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres refusés</div>
      <hr>
    </div>

    <q-expansion-item v-for="s in allVoteKo" :key="s.id" class="shadow-1 q-mb-md">
        <template v-slot:header style="padding: 0">
          <q-item-section avatar>
            <q-avatar square size="64px">
              <img :src="s.images[0].url">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label overline>{{s.name}}</q-item-label>
            <q-item-label>{{s.artist}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <q-list>
                <q-item-label v-if="s.votes && s.votes.length" style="width: 100%">
                  <div class="row q-ma-xs justify-between" v-for="vote in s.votes" :key="vote._id">
                    <div class="col text-grey-9">{{ vote.created_by }}</div>
                    <div class="col col-auto" >
                      <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                    </div>
                  </div>
                  <div class="text-grey-6 q-caption q-ml-xs q-mt-sm" v-if="s.comment">Commentaire :
              <div v-html="s.comment" syle="word-break: break-word;"></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-md" style="font-size: 12px">Proposé le {{ formatDate(s.createdAt) }} par {{ s.created_by }}</div>
                </q-item-label>
            </q-list>
            <q-separator class="q-mt-sm"/>
            <q-card-actions align="around" class="q-mb-none q-pb-none">
              <q-btn @click="launchDeezer(s)" flat icon="fab fa-deezer" size="md"></q-btn>
              <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
              <q-btn @click="showUpdateModal(s)" flat icon="star_border" label="Voter" size="md" color="yellow-10"></q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-expansion-item>
  </q-page>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

export default {
  name: 'TrackList',
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
    ...mapState('main', ['user', 'currentGroup']),
    average () {
      return parseInt((this.currentGroup.users.length * 5) / 1.2)
    },
    allVoteOk () {
      const result = []
      this.currentGroup.songs.forEach(el => {
        const total = el.votes.reduce((tot, num) => {
          return (tot.vote || tot) + num.vote
        })
        if (total > this.average) {
          el.total = total
          result.push(el)
        }
      })
      return orderBy(result, ['total'], ['desc'])
    },
    allVoteKo () {
      const result = []
      this.currentGroup.songs.forEach(el => {
        console.log(el.votes.length, this.currentGroup.users.length)
        if (el.votes.length === this.currentGroup.users.length) {
          const total = el.votes.reduce((tot, num) => {
            console.log(tot, num)
            return (tot.vote || tot) + num.vote
          })
          console.log('total =>', total)
          if (total <= this.average) {
            el.total = total
            result.push(el)
          }
        }
      })
      return orderBy(result, ['total'], ['desc'])
    }
  },
  methods: {
    getVote (song) {
      const vote = song.votes.find(v => v.profile === this.user.profile)
      return vote.vote
    },
    getTotal (votes) {
      return votes.reduce((tot, num) => {
        return (tot.vote || tot) + num.vote
      })
    },
    launchSpotify (id) {
      location.href = id
    },
    launchDeezer (s) {
      axios.get('https://api.deezer.com/search?q=' + s.name + ' ' + s.artist)
        .then(r => {
          location.href = r[0].link
        })
    },
    showUpdateModal (track) {
      this.updateOpened = true
      this.ratingModel = 1
      this.trackSelected = track
    },
    updateVote () {
      this.$store.dispatch('main/changeLoadingState', true)
      const vote = this.trackSelected.votes.find(v => v.created_by_id === this.user.id)
      this.$store.dispatch('main/updateVote', {
        voteId: vote.id,
        value: this.ratingModel
      })
        .then(r => {
          this.$store.dispatch('main/getCurrentGroup', {
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
            // this.getSelections()
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'êtes pas connecté. Veuillez relancer l\'application',
          position: 'top'
        })
      } */
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
