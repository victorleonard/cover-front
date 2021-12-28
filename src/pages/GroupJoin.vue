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
            v-model="message"
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
    <div class="col" v-if="groups && groups.length">
      <q-expansion-item v-for="group in groups" :key="group.id" class="shadow-1 q-mb-md bg-white">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar square size="80px">
              <q-img :ratio="4/4" :src="group.attributes.image.data.attributes.url" contain alt="" class="bg-grey-9" />
            </q-avatar>
            <div class="absolute q-item-letter">
              Rock
            </div>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium text-subtitle1">{{group.attributes.name}}</q-item-label>
            <q-item-label>{{group.attributes.locality}}</q-item-label>
            <!-- <q-chip style="width:140px" size="sm" v-if="alreadyAsk(group.id)" icon="fas fa-clock" label="Demande en attente" />
            <q-chip style="width:80px" size="sm" v-if="isAlreadyMember(group.attributes.profiles)" icon="eva-music-outline" label="Membre" /> -->
          </q-item-section>
        </template>

        <q-card class="bg-white">
          <q-card-section>
            <q-list bordered class="q-px-md rounded-borders">
              <q-item-label header>Membres</q-item-label>
              <q-item v-for="profile in group.attributes.profiles.data" :key="profile.id">
                <!-- <q-item-section avatar>
                  <q-avatar rounded>
                    <img v-if="profile.avatar" :src="profile.avatar.url" alt="avatar">
                    <q-icon v-else name="eva-person-outline" />
                  </q-avatar>
                </q-item-section> -->
                <q-item-section>{{ profile.attributes.pseudo }}</q-item-section>
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
    <div class="col" v-if="search.noResults">
      Aucun résultat
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
    search: {
      name: '',
      noResults: false
    },
    groupSelected: undefined,
    groups: undefined,
    message: ''
  }),
  computed: {
    ...mapState('main', ['user'])
  },
  methods: {
    sendMessage () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.post('chatrooms/message/new/group', {
        group_id: this.groupSelected.id,
        message: this.message
      })
        .then(() => {
          this.message = ''
          this.dialog.message = false
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'positive',
            message: 'Message envoyé au groupe',
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
      this.$axios.get(`/groups?populate=image,profiles,instruments&filters[name][$containsi]=${this.search.name}`)
        .then((res) => {
          if (!res.data.data.length) {
            this.search.noResults = true
          } else {
            this.search.noResults = false
            this.groups = res.data.data
          }
        })
    },
    getGroups () {
      this.$axios.get('/groups?populate=image,profiles,instruments')
        .then((res) => {
          this.groups = res.data.data
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
    }
  }
}
</script>
