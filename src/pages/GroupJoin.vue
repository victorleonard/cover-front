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
    <h4 class="q-mt-md q-mb-md">Liste des groupes</h4>
    <q-card class="my-card q-mb-lg" v-for="group in groups" :key="group.id">
      <img :src="getBestFormatImage(group.image.formats)" alt="group image">

      <q-card-section>
        <div class="text-h6">{{ group.name }}</div>
        <div class="text-subtitle2">{{ group.commune }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-chip v-for="user in group.users" :key="user.id">
          <q-avatar v-if="user.profile.avatar">
            <img :src="user.profile.avatar.url" alt="avatar">
          </q-avatar>
          {{ user.profile.pseudo }}
        </q-chip>
      </q-card-section>
      <q-card-actions align="right" v-if="isAlreadyMember(group.id)">
        <div><q-chip color="green" text-color="white" icon="fas fa-guitar" label="Déjà membre" /></div>
      </q-card-actions>
      <q-card-actions align="right" v-else>
        <q-btn v-if="!alreadyAsk(group.id)" @click="askInvitationDialog = true, groupSelected = group" color="primary" label="rejoindre" icon-right="fas fa-caret-right" />
        <div v-else><q-chip color="red" text-color="white" icon="fas fa-clock" label="Demande en attente" /></div>
      </q-card-actions>
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
    message: ''
  }),
  computed: {
    ...mapState('main', ['groups', 'user', 'myAskingInvitations'])
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
        to: this.groupSelected.admin.id,
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
    this.$store.dispatch('main/getMyAskingInvitation')
  }
}
</script>
