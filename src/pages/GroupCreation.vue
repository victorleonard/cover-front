<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>Nom :</div>
          <q-input
            bg-color="white"
            outlined
            v-model="name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />

          <div>Lieu de répète :</div>
          <search-city :cityProp="city" :error="cityError" @city_selected="selectCity" @clear="clearLocation" />
          <div>Image :</div>
          <div v-if="image" class="relative-position">
            <q-img :src="image.url" spinner-color="white" />
            <q-btn
              round
              color="red"
              icon="close"
              size="xs"
              @click="image = undefined"
              style="position: absolute; right: 5px; top: 5px"
            />
          </div>
          <q-uploader
            v-else
            style="width: 95%"
            hide-upload-btn
            @added="fileIsAdded"
            :multiple="false"
            :factory="upload"
            accept=".jpg, image/*"
            @rejected="onRejected"
          />
          <!-- <q-separator />
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
          <q-separator /> -->
          <div class="q-mt-lg">
            <q-btn label="Créer" unelevated no-caps type="submit" color="brand" icon="eva-save-outline" />
            <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import SearchCity from 'src/components/SearchCity.vue'

export default {
  name: 'group-creation',
  components: { SearchCity },
  data: () => ({
    city: undefined,
    location: {
      place_id: '',
      name: '',
      type: '',
      country: ''
    },
    cityError: false,
    searchAddressLoading: false,
    newMember: false,
    name: '',
    file: '',
    image: undefined,
    users: undefined,
    usersList: undefined
  }),
  computed: {
    ...mapState('main', ['profile', 'user', 'token'])
  },
  methods: {
    selectCity (val) {
      this.cityError = false
      this.location = {
        name: val.structured_formatting.main_text,
        country: val.structured_formatting.secondary_text,
        place_id: val.place_id
      }
    },
    clearLocation () {
      this.location = {
        name: '',
        place_id: '',
        country: ''
      }
    },
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
    editAvatar () {
      this.$store.dispatch('main/changeLoadingState', true)
      const formData = new FormData()
      formData.append('files', this.file)
      this.$axios.post('https://cover-mobile.herokuapp.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(r => {
          this.$axios.put(`profiles/${this.profile.id}`, {
            avatar: r.data[0].id
          })
            .then(() => { this.getProfileData() })
        })
    },
    async onSubmit () {
      try {
        if (this.file) {
          this.$store.dispatch('main/changeLoadingState', true)
          const formData = new FormData()
          formData.append('files', this.file)
          this.$axios.post('https://cover-mobile.herokuapp.com/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            .then(r => {
              this.$axios.post('/groups', {
                admin: this.$q.cookies.get('profile_id'),
                name: this.name,
                image: r.data[0].id,
                place_id: this.location.place_id,
                profiles: [this.$q.cookies.get('profile_id')]
              })
                .then(() => {
                  this.$store.dispatch('main/changeLoadingState', false)
                  this.$q
                    .dialog({
                      title: 'Groupe créé',
                      persistent: true,
                      message: 'Votre groupe a bien été créé ! 💫'
                    })
                    .onOk(() => {
                      this.$router.push({
                        name: 'home'
                      })
                    })
                })
            })
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'Merci de mettre une image',
            position: 'top'
          })
        }
      } catch (e) {
        this.$store.dispatch('main/changeLoadingState', false)
        this.$q.notify({
          type: 'negative',
          message: e.response.data.message,
          position: 'top'
        })
      }
    }
  }
}
</script>
