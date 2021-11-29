<template>
<q-pull-to-refresh @refresh="refresh">
  <q-page class="bg-grey-2">
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
            <q-btn flat color="primary" no-caps label="Voter" @click="vote" />
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
            <q-btn flat color="primary" no-caps label="Modifer mon vote" @click="updateVote" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    <!--//////////// -->
    <!-- awaitingVote -->
    <!--//////////// -->
    <q-header :style="revealClass === undefined ? 'margin-top: 50px' : null" :class="!revealClass || revealClass === undefined ? 'revealClassOff' : 'revealClassOn'" reveal @reveal="reveal">
        <q-tabs
          v-model="tab"
          align="justify"
          no-caps
          class="bg-white text-grey-8"
          inline-label
          active-color="brand"
          indicator-color="brand"
        >
          <q-tab name="awaitingVote" active-class="text-brand" label="Votes en attente" />
          <q-tab name="alreadyVote" active-class="text-brand" label="Votes effectués" />
        </q-tabs>
      </q-header>

    <q-tab-panels class="bg-grey-2 q-mt-lg q-pt-lg" v-model="tab" animated swipeable>
      <q-tab-panel name="awaitingVote">
        <div class="q-mb-xl" v-if="awaitingVote && awaitingVote.length">
          <!-- <div class="q-ml-sm q-mr-sm q-mb-lg">
            <div
              class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">
              Votes en attente
            </div>
            <hr>
          </div> -->
          <div>
            <div class="row">
              <Card
                class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm"
                @displayVoteDialog="displayVoteDialog"
                @loadSongs="loadSongs"
                v-for="s in awaitingVote"
                :song="s"
                :profiles="profiles"
                :key="s._id" />
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="alreadyVote">
        <!--//////////// -->
        <!-- alreadyVote -->
        <!--/////////////-->
        <div v-if="noSelection && noSelection.length">
          <!-- <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
            <div
              class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">
              Votes effectués</div>
            <hr>
          </div> -->
          <div class="row">
            <Card
              class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm"
              @displayVoteDialog="displayVoteDialog"
              v-for="s in noSelection"
              @loadSongs="loadSongs"
              :song="s"
              :profiles="profiles"
              :key="s._id" />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <div v-if="noSelection && !noSelection.length" class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Aucun vote en cours</div>
    </div>
  </q-page>
</q-pull-to-refresh>
</template>

<script>
import Card from './../components/Card'

export default {
  name: 'vote',
  components: { Card },
  data () {
    return {
      revealClass: undefined,
      tab: 'awaitingVote',
      profiles: undefined,
      currentGroupSongs: undefined,
      songSelected: undefined,
      ratingModel: 0,
      voteDialog: false,
      comment: '',
      voteDialogUpdate: false,
      commentTempUser: '',
      commentTemp: '',
      commentDialog: false
    }
  },
  computed: {
    awaitingVote () {
      const userId = this.$q.cookies.get('user_id')
      if (this.profiles && this.currentGroupSongs) {
        const wait = this.currentGroupSongs.filter(el => el.votes &&
          el.votes.length !== this.profiles.length &&
          !el.votes.find(v => v.user === userId))
        return wait
      } else {
        return undefined
      }
    },
    noSelection () {
      const userId = this.$q.cookies.get('user_id')
      if (this.profiles && this.currentGroupSongs) {
        const wait = this.currentGroupSongs.filter(el => el.votes &&
          el.votes.length !== this.profiles.length &&
          el.votes.find(v => v.user === userId))
        return wait
      } else {
        return undefined
      }
    }
  },
  methods: {
    reveal (event) {
      this.revealClass = event
    },
    refresh (done) {
      this.$store.dispatch('main/getCurrentGroupSongs', {
        groupId: this.$route.params.groupId
      })
        .then(r => {
          this.currentGroupSongs = r.data
          done()
        })
    },
    loadSongs () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/getCurrentGroupSongs', {
        groupId: this.$route.params.groupId
      })
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.currentGroupSongs = r.data
        })
    },
    displayVoteDialog (t) {
      const userId = this.$q.cookies.get('user_id')
      this.songSelected = t
      console.log(t)
      if (t.votes.find(v => v.user === userId)) {
        this.voteDialogUpdate = true
        this.ratingModel = t.votes.find(v => v.user === userId).vote
      } else {
        this.voteDialog = true
      }
    },
    vote () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/vote', {
        value: this.ratingModel,
        songId: this.songSelected.id,
        groupId: this.$route.params.groupId,
        userId: this.$q.cookies.get('user_id'),
        comment: this.comment
      })
        .then(() => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then((r) => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.currentGroupSongs = r.data
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
      const userId = this.$q.cookies.get('user_id')
      this.$store.dispatch('main/changeLoadingState', true)
      const vote = this.songSelected.votes.find(v => v.user === userId)
      this.$store.dispatch('main/updateVote', {
        voteId: vote.id,
        value: this.ratingModel,
        comment: this.comment
      })
        .then(() => {
          this.$store.dispatch('main/getCurrentGroupSongs', {
            groupId: this.$route.params.groupId
          })
            .then((r) => {
              this.currentGroupSongs = r.data
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
    }
  },
  created () {
    this.$store.dispatch('main/changeLoadingState', true)
    this.$axios.get(`/profiles?groups.id=${this.$route.params.groupId}`)
      .then(r => {
        this.profiles = r.data
      })
    this.$store.dispatch('main/getCurrentGroupSongs', {
      groupId: this.$route.params.groupId
    })
      .then(r => {
        this.$store.dispatch('main/changeLoadingState', false)
        this.currentGroupSongs = r.data
      })
  }
}
</script>

<style lang="scss" scoped>
  .revealClassOn {
    margin-top: 50px;
  }
  .revealClassOff {
    margin-top: 55px;
  }
</style>
