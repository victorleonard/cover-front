<template>
<q-page padding>
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
      <q-card-actions>
        <q-btn v-if="!alreadyAsk(group.id)"  @click="askInvitation(group)">Rejoindre</q-btn>
        <div v-else>En Attente...</div>
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
    pseudo: ''
  }),
  computed: {
    ...mapState('main', ['groups', 'user', 'myAskingInvitations'])
  },
  methods: {
    alreadyAsk (groupId) {
      return this.myAskingInvitations.find(a => a.group.id === groupId)
    },
    askInvitation (group) {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/askInvitation', {
        group: group.id,
        to: group.admin.id
      })
        .then(() => {
          this.$store.dispatch('main/getMyAskingInvitation')
          this.$store.dispatch('main/changeLoadingState', false)
        })
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getGroups')
    this.$store.dispatch('main/getMyAskingInvitation')
  }
}
</script>
