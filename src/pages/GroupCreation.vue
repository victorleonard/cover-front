<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>Nom :</div>
          <q-input
            filled
            v-model="name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-separator />

          <div>Lieu de répète :</div>
          <q-select
            filled
            :loading="searchAddressLoading"
            :value="address"
            use-input
            clearable
            hide-selected
            fill-input
            lazy-rules
            error-message="Please select something"
            input-debounce="500"
            :options="addresses"
            @filter="filterAddressFn"
            @input-value="setAddress"
            @clear="
              addresses = [];
              address = '';
            "
            label=""
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label>{{
                    `${scope.opt.properties.label}`
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option v-if="address && address.length">
              <q-item>
                <q-item-section class="text-grey">
                  Aucun résultat
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-separator />
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
          <div>
            <q-btn label="Créer" type="submit" color="brand" />
            <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'group-creation',
  data: () => ({
    searchAddressLoading: false,
    address: '',
    addresses: [],
    form: {
      address: ''
    },
    cityModel: '',
    cityOptions: undefined,
    newMember: false,
    name: '',
    file: '',
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
    filterAddressFn (val, update, abort) {
      update(() => {
        if (val.length) {
          this.searchAddressLoading = true
          axios
            .get(`https://api-adresse.data.gouv.fr/search/?q=${val}`)
            .then(resp => {
              this.addresses = resp.data.features
              this.searchAddressLoading = false
              update()
            })
        }
      })
    },
    setAddress (val) {
      if (val && val.properties) {
        this.form.address = val
        this.address = val.properties.label
      }
    },
    filterFn (val, update, abort) {
      update(() => {
        console.log(val)
        axios.get('https://geo.api.gouv.fr/communes?nom=' + val + '&fields=nom,code,codesPostaux,codeDepartement,codeRegion,population&format=json&geometry=centre')
          .then(r => {
            this.cityOptions = r.data
            console.log(r)
          })
      })
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
                city: this.form.address.properties.city,
                postcode: this.form.address.properties.postcode,
                citycode: this.form.address.properties.citycode,
                region: this.form.address.properties.context.split(',')[2].trim(),
                department: this.form.address.properties.context
                  .split(',')[1]
                  .trim(),
                address: this.form.address.properties.name,
                country: 'FR',
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
