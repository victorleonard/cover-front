<template>
<q-page padding class="search-page">
  <div class="row q-mb-md">
    <div class="col">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
        <div class="row flex items-center">
          <div class="col">
            <q-input v-model="search.name" color="brand" class="bg-white q-pl-sm" label="Rechercher" dense />
          </div>
          <div class="col col-auto">
            <q-btn type="submit" unelevated color="brand" icon="search" style="height: 39px; border-radius: 0px;"/>
          </div>
        </div>
        </q-form>
    </div>
  </div>
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
          <q-btn flat color="brand" no-caps label="Envoyer ma demande" @click="askInvitation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog full-width v-model="dialog.message">
      <q-card v-if="groupSelected" class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="text-h6">
              Envoyer un message à l'admin du groupe <em>{{ groupSelected.name }}</em>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            color="brand"
            class="q-mt-md"
            label="message"
            v-model="mail.content"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="brand" unelevated icon="far fa-paper-plane" no-caps label="Envoyer" @click="sendMessage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  <div class="row">
    <div class="col">
      <q-expansion-item v-for="group in groups" :key="group.id" class="shadow-1 q-mb-md bg-white">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar square size="80px">
              <q-img :ratio="4/4" :src="group.image.url" contain alt="" class="bg-grey-9" />
            </q-avatar>
            <div class="absolute q-item-letter">
              Rock
            </div>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium text-subtitle1">{{group.name}}</q-item-label>
            <q-item-label>{{group.locality}}</q-item-label>
            <q-chip style="width:140px" size="sm" v-if="alreadyAsk(group.id)" icon="fas fa-clock" label="Demande en attente" />
            <q-chip style="width:80px" size="sm" v-if="isAlreadyMember(group.profiles)" icon="eva-music-outline" label="Membre" />
          </q-item-section>
        </template>

        <q-card class="bg-white">
          <q-card-section>
            <q-list bordered class="q-px-md rounded-borders">
              <q-item-label header>Membres</q-item-label>
              <q-item v-for="profile in group.profiles" :key="profile.id">
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img v-if="profile.avatar" :src="profile.avatar.url" alt="avatar">
                    <q-icon v-else name="eva-person-outline" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ profile.pseudo }}</q-item-section>
                <q-item-section side>
                  Guitare
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        <q-separator />
        <q-card-actions align="around">
          <q-item-section>
            <q-btn color="brand" no-caps label="Envoyer un message" unelevated icon="eva-email-outline" @click="dialog.message = true, groupSelected = group" />
          </q-item-section>
          <!-- <q-item-section v-if="isAlreadyMember(group.profiles)">
            <q-chip style="width:130px" color="brand" text-color="white" label="Déjà membre" />
          </q-item-section>
          <q-item-section  v-else>
            <q-btn v-if="!alreadyAsk(group.id)" @click="askInvitationDialog = true, groupSelected = group" color="brand" no-caps label="Rejoindre" unelevated icon-right="fas fa-caret-right" />
            <div v-else>
              <q-chip color="red" text-color="white" icon="fas fa-clock" label="Demande en attente" />
            </div>
          </q-item-section> -->
          <q-separator vertical inset class="q-ml-sm"/>
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                </q-list>
              </q-menu>
            </q-btn>
        </q-card-actions>
      </q-card>
    </q-expansion-item>
    </div>
  </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group-join',
  data: () => ({
    dialog: {
      message: false
    },
    mail: {
      content: ''
    },
    search: {
      name: ''
    },
    pseudo: '',
    askInvitationDialog: false,
    groupSelected: undefined,
    groups: undefined,
    message: '',
    myAskingInvitations: undefined
  }),
  computed: {
    ...mapState('main', ['user'])
  },
  methods: {
    sendMessage () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.post('messages', {
        from: this.$q.cookies.get('profile_id'),
        to: this.groupSelected.admin.id,
        messages: [{
          content: this.mail.content,
          profile_id: this.$q.cookies.get('profile_id'),
          created: new Date()
        }]
      })
        .then(() => {
          this.mail = {
            content: '',
            object: ''
          }
          this.$store.dispatch('main/getMyProfile')
          this.dialog.message = false
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'positive',
            message: 'Message envoyé',
            position: 'top'
          })
        })
        .catch(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'negative',
            message: 'Server error',
            position: 'top'
          })
        })
    },
    onSubmit () {
      this.$axios.get(`/groups?name_contains=${this.search.name}`)
        .then((res) => {
          this.groups = res.data
        })
    },
    getGroups () {
      this.$axios.get('/groups')
        .then((res) => {
          this.groups = res.data
        })
    },
    getBestFormatImage (formats) {
      if (formats.medium) {
        return formats.medium.url
      } else if (formats.small) {
        return formats.small.url
      } else {
        return formats.thumbnail.url
      }
    },
    isAlreadyMember (profiles) {
      return profiles.find(p => p.id === this.user.profile)
    },
    alreadyAsk (groupId) {
      return this.myAskingInvitations.find(a => a.group.id === groupId)
    },
    askInvitation () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.post('/invitations', {
        group: this.groupSelected.id,
        to: this.groupSelected.admin.user,
        from: this.$q.cookies.get('profile_id'),
        message: this.message
      })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Votre demande a été envoyé',
            position: 'top'
          })
          this.$axios.get('/invitations?from=' + this.$q.cookies.get('profile_id'))
            .then(res => {
              this.myAskingInvitations = res.data
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
  created () {
    this.getGroups()
  },
  beforeCreate () {
    this.$axios.get('/invitations?from=' + this.$q.cookies.get('profile_id'))
      .then(res => {
        this.myAskingInvitations = res.data
      })
  }
}
</script>
