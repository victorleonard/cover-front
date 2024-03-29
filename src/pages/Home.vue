<template>
  <q-page padding>
    <div class="row q-pt-md q-pl-sm q-pr-sm">
      <q-card v-for="group in myGroupsOrder" :key="group.id" class="my-card q-mb-lg" style="width: 100%">
        <q-img class="bg-grey-9" :ratio="16/9" contain :src="group.image.url">
          <div class="text-h6 absolute-top text-left">
            {{ group.name }}
          </div>
        </q-img>
        <q-card-section class="q-pr-xl">
        <q-chip v-for="profile in group.profiles" :key="profile.id">
          <q-avatar v-if="profile.avatar">
            <img :src="profile.avatar.url" alt="avatar">
          </q-avatar>
          {{ profile.pseudo }}
        </q-chip>
      </q-card-section>

      <q-separator inset v-if="hasInvitation(group.id)"/>

        <q-card-section v-if="hasInvitation(group.id)">
          <q-item>
            <q-item-section>Des musiciens souhaitent rejoindre ton groupe 😃</q-item-section>
          </q-item>
          <q-list bordered separator v-for="demand in myPendingDemandInvitations" :key="demand.id">
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ demand.from.pseudo }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ demand.from.pseudo }}</q-item-label>
                <q-item-label caption lines="1">...</q-item-label>
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
        <q-btn color="white" style="position: absolute; top: 12px; right: 0; border-radius: 0" v-if="isAdmin(group.admin)" no-caps icon="eva-edit-outline" flat :to="{ name: 'group-edit', params: { groupId: group.id } }"></q-btn>
        <q-btn size="lg" style="position: absolute; bottom: 0; right: 0; border-radius: 0" unelevated :to="{ name: 'group', params: { groupId: group.id } }" color="brand" icon="eva-arrow-right-outline" />
      </q-card-actions>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { Plugins } from '@capacitor/core'
const { PushNotifications } = Plugins
import orderBy from 'lodash/orderBy'

export default {
  name: 'home',
  data: () => ({
    myGroups: undefined
  }),
  computed: {
    ...mapState('main', ['profile', 'user', 'myDemandInvitations']),
    myGroupsOrder () {
      return orderBy(this.myGroups, ['name'], ['desc'])
    },
    myPendingDemandInvitations () {
      if (!this.myDemandInvitations) return
      return this.myDemandInvitations.filter(el => el.status === 'pending')
    }
  },
  methods: {
    getBestFormatImage (formats) {
      console.log(formats)
      if (formats.medium) {
        return formats.medium.url
      } else if (formats.small) {
        return formats.small.url
      } else {
        return formats.thumbnail.url
      }
    },
    hasInvitation (groupId) {
      if (!this.myDemandInvitations) return
      return this.myPendingDemandInvitations.find(el => el.group.id === groupId)
    },
    pushRequestPermission () {
      PushNotifications.requestPermission().then(result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register()
        } else {
        // Show some error
        }
      })

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token) => {
          this.$store.dispatch('main/setIosDeviceToken', {
            token: token.value
          })
          // alert('Push registration success, token: ' + token.value)
        }
      )

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error) => {
          alert('Error on registration: ' + JSON.stringify(error))
        }
      )

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification) => {
          // alert('Push received: ' + JSON.stringify(notification))
        }
      )

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification) => {
          // alert('Push action performed: ' + JSON.stringify(notification))
        }
      )
    },
    isAdmin (admin) {
      return admin.id === this.user.profile
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
                .catch(error => {
                  console.log('getMyGroups error', error)
                  this.$store.dispatch('main/changeLoadingState', false)
                })
            })
        })
    }
  },
  mounted () {
    this.$store.dispatch('main/changeLoadingState', true)
    this.$store.dispatch('main/getMyGroups', {
      profileId: this.$q.cookies.get('profile_id')
    })
      .then(r => {
        this.myGroups = r
        this.$store.dispatch('main/changeLoadingState', false)
        if (!r.length) {
          this.$router.push({ name: 'create-or-join' })
        }
      })
      .catch(error => {
        console.error('error', error)
        this.$store.dispatch('main/changeLoadingState', false)
      })
  },
  beforeCreate () {
    this.$store.dispatch('main/getMyDemandInvitation', {
      userId: this.$q.cookies.get('user_id')
    })
  }
}
</script>
