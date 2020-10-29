<template>
  <q-page v-if="currentGroup" padding class="search-page q-pl-md q-pr-md">
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
                    <div class="col text-grey-9">{{ getUserPseudo(vote.created_by_id) }}</div>
                    <div class="col col-auto" >
                      <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                      <q-btn @click="displayComment(vote)" v-if="vote.comment" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
                    </div>
                  </div>
                </q-item-label>
            </q-list>
          </q-card-section>
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
          </q-card-actions>
        </q-card>
      </q-expansion-item>

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
                    <div class="col text-grey-9">{{ getUserPseudo(vote.created_by_id) }}</div>
                    <div class="col col-auto" >
                      <q-rating slot="subtitle" :value="vote.vote" readonly :max="5" />
                      <q-btn @click="displayComment(vote)" v-if="vote.comment" style="position: absolute; margin-top: -2.1px" size="xs" flat round color="primary" icon="fas fa-info-circle" />
                    </div>
                  </div>
                </q-item-label>
            </q-list>
          </q-card-section>
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
          </q-card-actions>
        </q-card>
      </q-expansion-item>
  </q-page>
</template>

<script>

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
      },
      commentTempUser: '',
      commentTemp: '',
      commentDialog: false
    }
  },
  computed: {
    ...mapState('main', ['user', 'currentGroup', 'currentGroupSongs']),
    average () {
      return parseInt((this.currentGroup.users.length * 5) / 1.3)
    },
    allVoteOk () {
      const result = []
      this.currentGroupSongs.forEach(el => {
        if (el.votes.length && el.votes.length === this.currentGroup.users.length) {
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
        if (el.votes.length && el.votes.length === this.currentGroup.users.length) {
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
    getUserPseudo (id) {
      if (this.currentGroup.profiles.find(p => p.user_id === id)) {
        return this.currentGroup.profiles.find(p => p.user_id === id).pseudo
      }
    },
    getUserAvatar (id) {
      const profile = this.currentGroup.profiles.find(p => p.user_id === id)
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
