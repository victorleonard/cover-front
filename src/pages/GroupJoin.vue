<template>
<q-page padding>
  <q-dialog v-model="askInvitationDialog">
      <q-card v-if="groupSelected" class="my-card" style="width: 70vw">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="text-h6">
              Rejoindre le groupe <em>{{ groupSelected.name }}</em>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Votre message :</p>
          <q-input
            v-model="message"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" label="Envoyer ma demande" @click="askInvitation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  <div class="row">
    <div class="col">
    <q-card flat v-for="group in groups" class="q-mb-md" :key="group.id">
      <q-card-section class="q-pa-none">
        <div class="row items-center bg-white">
          <div class="col col-3 col-md-6">
            <q-img
              :ratio="4/3" contain
              :src="group.image.url"
              class="bg-grey-9"
              style="max-height: 100px;"
              spinner-color="white"
            />
            <!-- <img style="max-width: 100%; display: block" :src="group.image.url" alt=""> -->
          </div>
          <div class="col q-pr-sm" style="line-height: 1.2rem">
            <div class="text-grey-9 q-title q-ml-sm">{{ group.name }}</div>
            <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ group.city }}</div>
          </div>
          <div class="col col-auto">
            <q-btn color="grey-7" size="lg" label="" flat icon-right="fas fa-caret-right" />
          </div>
        </div>
      </q-card-section>
      <!-- <q-card-section>
        <q-chip v-for="profile in group.profiles" :key="profile.id">
          <q-avatar v-if="profile.avatar">
            <img :src="profile.avatar.url" alt="avatar">
          </q-avatar>
          {{ profile.pseudo }}
        </q-chip>
      </q-card-section> -->
      <!-- <q-card-actions align="right" v-if="isAlreadyMember(group.id)">
        <div><q-chip color="green" text-color="white" icon="fas fa-guitar" label="Déjà membre" /></div>
      </q-card-actions>
      <q-card-actions align="right" v-else>
        <q-btn v-if="!alreadyAsk(group.id)" @click="askInvitationDialog = true, groupSelected = group" color="primary" label="rejoindre" icon-right="fas fa-caret-right" />
        <div v-else><q-chip color="red" text-color="white" icon="fas fa-clock" label="Demande en attente" /></div>
      </q-card-actions> -->
    </q-card>
    </div>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group-join',
  data: () => ({
    pseudo: '',
    askInvitationDialog: false,
    groupSelected: undefined,
    message: '',
    myAskingInvitations: undefined
  }),
  computed: {
    ...mapState('main', ['groups', 'user'])
  },
  methods: {
    getBestFormatImage (formats) {
      if (formats.medium) {
        return formats.medium.url
      } else if (formats.small) {
        return formats.small.url
      } else {
        return formats.thumbnail.url
      }
    },
    isAlreadyMember (groupId) {
      return this.user.groups.find(g => g === groupId)
    },
    alreadyAsk (groupId) {
      return this.myAskingInvitations.find(a => a.group.id === groupId)
    },
    askInvitation () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/askInvitation', {
        group: this.groupSelected.id,
        to: this.groupSelected.admin.user,
        message: this.message
      })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Votre demande a été envoyé',
            position: 'top'
          })
          this.$store.dispatch('main/getMyAskingInvitation')
            .then(() => {
              this.askInvitationDialog = false
              this.$store.dispatch('main/changeLoadingState', false)
            })
        })
        .catch(error => {
          this.$q.dialog({
            title: 'Error',
            message: error.response.data.data[0].messages[0].message
          })
        })
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getGroups')
    this.$axios.get('/invitations?from=' + this.$q.cookies.get('profile_id'))
      .then(res => {
        this.myAskingInvitations = res.data
      })
  }
}
</script>
