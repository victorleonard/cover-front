<template>
  <q-page padding>
    <div class="row">
      <h6 class="q-mt-xs q-mb-lg">Group Edit</h6>
    </div>
    <div class="row">
      <div class="col">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            type="number"
            v-model="score"
            label="Score *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            filled
            v-model="name"
            label="Nom *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-separator />
          <div>Lieu de répète : {{ this.commune }} ({{ this.codeDepartement }})</div>
          <q-separator />
          <div v-if="image" class="relative-position">
            <q-img
              :src="image.url"
              spinner-color="white"
            />
            <q-btn round color="red" icon="close" size="xs" @click="image = undefined" style="position: absolute; right: 5px; top: 5px" />
          </div>
          <q-uploader v-else
          hide-upload-btn
          @added="fileIsAdded"
          :multiple="false"
          :factory="upload"
          accept=".jpg, image/*"
          @rejected="onRejected"
          />
          <q-separator />
            <div>
              <h6 class="q-mb-xs q-mt-xs text-subtitle1">Users</h6>
              <q-list bordered separator class="rounded-borders">
                <div v-for="user in users" :key="user.id">
                  <q-item tag="label">
                    <q-item-section>
                      <q-item-label>{{ user.username }}</q-item-label>
                    </q-item-section>
                    <q-item-section side >
                      <q-btn round color="red" icon="close" size="xs" />
                    </q-item-section>
                  </q-item>
              </div>
              </q-list>
              <q-btn class="q-mt-sm" label="Ajouter un membre" @click="addMember" color="primary"/>

              <q-dialog
                v-model="newMember"
              >
                <q-card style="width: 700px; max-width: 80vw;">
                  <q-card-section>
                    <div class="text-h6">Selectionner un utilisateur</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-list bordered separator class="rounded-borders">
                      <q-item v-for="user in usersList" :key="user.id" tag="label">
                        <q-item-section>
                          <q-item-label>{{ user.pseudo }}</q-item-label>
                        </q-item-section>
                        <q-item-section v-if="user.instruments">
                          <q-item-label>{{ user.instruments[0].nom }}</q-item-label>
                        </q-item-section>
                        <q-item-section side >
                          <q-btn flat color="primary" icon="ion-md-add-circle" size="md" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>

                  <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="Cancel" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          <q-separator />
          <div>
            <q-btn label="Change" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group-edit',
  data: () => ({
    newMember: false,
    name: '',
    file: '',
    score: 0,
    image: undefined,
    codeRegion: '',
    commune: '',
    codeDepartement: '',
    users: undefined,
    usersList: undefined
  }),
  computed: {
    ...mapState('main', ['profile', 'user', 'token'])
  },
  methods: {
    addMember () {
      this.$store.dispatch('main/getProfiles')
        .then(r => {
          this.usersList = r.data
          this.newMember = true
        })
    },
    fileIsAdded (file) {
      this.file = file[0]
    },
    upload (file) {
      this.$store.dispatch('main/upload', {
        file: file[0]
      })
      console.dir('file', file)
    },
    onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    getGroupData () {
      this.$store.dispatch('main/getGroup', {
        groupId: this.$route.params.groupId
      })
        .then(r => {
          console.log('GROUP ===> ', r)
          const d = r.data
          this.commune = d.commune
          this.codeRegion = d.codeRegion
          this.codeDepartement = d.codeDepartement
          this.image = d.image
          this.name = d.name
          this.users = d.users
          this.score = d.score
        })
    },
    async onSubmit () {
      try {
        if (this.file) {
          console.log('upload File !')
          this.$store.dispatch('main/upload', {
            file: this.file
          })
            .then(r => {
              console.log('reponse file', r)
              this.$store.dispatch('main/updateGroup', {
                groupId: this.$route.params.groupId,
                name: this.name,
                image: r[0].id,
                score: this.score
              })
                .then(() => { this.getGroupData() })
            })
        } else {
          await this.$store.dispatch('main/updateGroup', {
            groupId: this.$route.params.groupId,
            name: this.name,
            score: this.score
          })
          this.$q.notify({
            type: 'positive',
            message: 'Le groupe a été modifié',
            position: 'top'
          })
          this.$store.dispatch('main/getMe')
        }
      } catch (e) {
        this.$store.dispatch('main/changeLoadingState', false)
        this.$q.notify({
          type: 'negative',
          message: e.response.data.message,
          position: 'top'
        })
      }
    },
    onReset () {
      this.getGroupData()
    }
  },
  mounted () {
    this.getGroupData()
  }
}
</script>
