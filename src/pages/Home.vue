<template>
  <q-page padding>
    <div class="row q-pt-md q-pl-sm q-pr-sm">
      <q-card v-for="group in myGroups" :key="group.id" class="my-card" style="width: 100%">
        <q-img :src="group.image.url">
          <div class="text-h6 absolute-top text-left">
            {{ group.name }}
          </div>
        </q-img>
        <q-card-section>
        <q-chip :icon="!user.avatar ? 'account_circle' : null" v-for="user in group.users" :key="user.id">
          <q-avatar v-if="user.avatar">
            <img :src="user.avatar.url" alt="avatar">
          </q-avatar>
          {{ user.username }}
        </q-chip>
      </q-card-section>

      <q-separator inset v-if="myPendingDemandInvitations && myPendingDemandInvitations.length" />

        <q-card-section v-if="myPendingDemandInvitations && myPendingDemandInvitations.length">
          <q-item>
            <q-item-section>Ces personnes souhaitent rejoindre ce groupe</q-item-section>
          </q-item>
          <q-list bordered separator v-for="demand in myPendingDemandInvitations" :key="demand.id">
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ demand.from.username[0] }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ demand.from.username }}</q-item-label>
                <q-item-label caption lines="1">Guitariste</q-item-label>
                <q-item-label caption>{{ demand.message }}</q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" color="red" flat dense round icon="clear" />
                  <q-btn size="12px" color="green" flat dense round icon="done" @click="acceptInvtation(group, demand)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-if="isAdmin(group.admin)" flat :to="{ name: 'group-edit', params: { groupId: group.id } }">Edit</q-btn>
        <q-btn round :to="{ name: 'group', params: { groupId: group.id } }" color="primary" icon="east" />
      </q-card-actions>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState('main', ['profile', 'user', 'myGroups', 'myDemandInvitations']),
    myPendingDemandInvitations () {
      return this.myDemandInvitations.filter(el => el.status === 'pending')
    }
  },
  methods: {
    isAdmin (admin) {
      return admin.id === this.user.id
    },
    getMe () {
      this.$store.dispatch('main/getMe')
    },
    acceptInvtation (group, demand) {
      this.$store.dispatch('main/changeLoadingState', true)
      const groupUsers = []
      group.users.forEach(u => {
        groupUsers.push(u.id)
      })
      groupUsers.push(demand.from.id)
      this.$store.dispatch('main/acceptInvitation', demand)
        .then(resp => {
          this.$store.dispatch('main/addGroupMember', {
            groupId: demand.group.id,
            userId: groupUsers
          })
            .then(r => {
              this.$store.dispatch('main/getMyGroups')
                .then(a => {
                  this.$store.dispatch('main/getMyDemandInvitation')
                  this.$store.dispatch('main/changeLoadingState', false)
                  this.$q.notify({
                    type: 'positive',
                    message: demand.from.username + ' a été ajouté au groupe ' + group.name,
                    position: 'top'
                  })
                })
            })
        })
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getMyGroups')
      .then(r => {
        if (!r.data.length) {
          this.$router.push({ name: 'create-or-join' })
        }
      })
    this.$store.dispatch('main/getMyDemandInvitation')
  }
}
</script>
