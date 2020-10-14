<template>
<q-page padding>
  <q-dialog v-model="askInvitationDialog">
      <q-card v-if="groupSelected" class="my-card" style="width: 70vw">
        <!-- <q-img :src="songSelected.album.images[0].url" /> -->

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
    <q-card class="my-card" v-for="group in groups" :key="group.id">
      <img :src="group.image.url" alt="group image">

      <q-card-section>
        <div class="text-h6">{{ group.name }}</div>
        <div class="text-subtitle2">{{ group.commune }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-chip :icon="!user.avatar ? 'account_circle' : null" v-for="user in group.users" :key="user.id">
          <q-avatar v-if="user.avatar">
            <img :src="user.avatar.url" alt="avatar">
          </q-avatar>
          {{ user.username }}
        </q-chip>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-if="!alreadyAsk(group.id)" @click="askInvitationDialog = true, groupSelected = group" round color="primary" icon="east" />
        <div v-else>Demande en Attente...</div>
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
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getGroups')
    this.$store.dispatch('main/getMyAskingInvitation')
  }
}
</script>
