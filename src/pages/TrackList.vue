<template>
  <q-page v-if="songAccepted" padding class="search-page q-pl-md q-pr-md">
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
      <div v-if="currentGroup" class="q-caption text-grey-10">Au moins {{ currentGroup.score }} <q-icon name="star" color="grey-8" /></div>
      <hr>
    </div>
    <div v-if="songAccepted">
    <CardResult
      :level="true"
      coverSize="80px"
      :profiles="profiles"
      @showLevelModal="showLevelModal"
      @showUpdateModal="showUpdateModal"
      :song="s"
      v-for="s in songAccepted"
      :key="s.id"
    />
    </div>

    <!-- Morceaux refusés -->
    <div class="q-mt-xl q-pb-md q-pt-lg">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres refusés</div>
      <q-btn
        @click="loadRefuseSong"
        color="primary"
        size="sm"
        label="voir"
      />
      <hr>
      </div>
    <div v-if="songRefused">
      <CardResult
        :level="false"
        coverSize="64px"
        @displayComment="displayComment"
        @showLevelModal="showLevelModal"
        @showUpdateModal="showUpdateModal"
        :profiles="profiles"
        :song="s"
        v-for="s in songRefused"
        :key="s.id"
      />
    </div>
  </q-page>
</template>

<script>

import { mapState } from 'vuex'
import orderBy from 'lodash/orderBy'
import CardResult from './../components/CardResult'

export default {
  name: 'TrackList',
  components: { CardResult },
  data () {
    return {
      songRefused: undefined,
      songAccepted: undefined,
      profiles: undefined,
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
    ...mapState('main', ['user', 'currentGroup'])
  },
  methods: {
    loadAcceptedSong () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/songs?group=${this.$route.params.groupId}&status=accepted`)
        .then(r => {
          const result = r.data.map((song) => {
            const songCopy = { ...song }
            const total = songCopy.votes.reduce((a, b) => a + b, 0)
            songCopy.total = total
            return songCopy
          })
          this.$store.dispatch('main/changeLoadingState', false)
          this.songAccepted = orderBy(result, ['total'], ['desc'])
        })
    },
    loadRefuseSong () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/songs?group=${this.$route.params.groupId}&status=refuse`)
        .then(r => {
          this.songRefused = r.data
          this.$store.dispatch('main/changeLoadingState', false)
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
        .catch(e => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'negative',
            message: e.reponse,
            position: 'top'
          })
        })
    }
  },
  mounted () {
    this.loadAcceptedSong()
    this.$axios.get(`/profiles?groups.id=${this.$route.params.groupId}`)
      .then(r => {
        this.profiles = r.data
      })
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
