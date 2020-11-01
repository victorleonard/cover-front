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
        <div
          class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">
          Votes en attente
        </div>
        <hr>
      </div>
      <div>
        <div class="row">
          <Card
            class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm"  @displayComment="displayComment"
            @displayVoteDialog="displayVoteDialog"
            v-for="s in awaitingVote"
            :song="s"
            :key="s._id" />
        </div>
      </div>
    </div>

    <!--//////////// -->
    <!-- alreadyVote -->
    <!--/////////////-->
    <div class="q-mt-xl" v-if="noSelection.length">
      <div class="q-mt-sm q-ml-sm q-mr-sm q-mb-lg">
        <div
          class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">
          Votes effectués</div>
        <hr>
      </div>
      <div class="row">
        <Card
          class="col-xs-12 col-sm-6 col-md-4 col-lg-2 q-mb-lg q-pl-sm q-pr-sm" @displayComment="displayComment"
          @displayVoteDialog="displayVoteDialog"
          v-for="s in noSelection"
          :song="s"
          :key="s._id" />
      </div>
    </div>
    <div v-else class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Aucun vote en cours</div>
    </div>
  </q-page>
</template>

<script>
import Api from '../services/Api'
import { mapState, mapGetters } from 'vuex'
import Card from './../components/Card'

export default {
  name: 'vote',
  components: { Card },
  data () {
    return {
      songSelected: undefined,
      // songSelect: false,
      ratingModel: 0,
      trackSelected: undefined,
      voteDialog: false,
      comment: '',
      voteDialogUpdate: false,
      commentTempUser: '',
      commentTemp: '',
      commentDialog: false
    }
  },
  computed: {
    ...mapState('main', ['currentGroup', 'user', 'currentGroupSongs']),
    ...mapGetters('main', ['awaitingVote']),
    noSelection () {
      const result = []
      this.currentGroupSongs.forEach(selection => {
        if ((selection.votes.length < this.currentGroup.profiles.length) && selection.votes.find(vote => vote.created_by_id === this.user.id)) {
          result.push(selection)
        }
      })
      return result
    }
  },
  methods: {
    displayVoteDialog (t) {
      this.songSelected = t
      if (t.votes.find(v => v.created_by_id === this.user.id)) {
        this.voteDialogUpdate = true
      } else {
        this.voteDialog = true
      }
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
    displayComment (song, user) {
      const vote = song.votes.find(v => v.profile_id === user.id)
      this.commentTempUser = vote.created_by
      this.commentTemp = vote.comment
      this.commentDialog = true
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
      const vote = this.songSelected.votes.find(v => v.created_by_id === this.user.id)
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
    }
  },
  mounted () {
    this.$store.dispatch('main/getCurrentGroupSongs', {
      groupId: this.$route.params.groupId
    })
  }
}
</script>
