<template>
<q-page padding v-if="profile && profileCopy">
  <q-dialog v-model="edit.pseudo">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Pseudo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="profileCopy.pseudo" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat no-caps label="Annuler" color="grey-8" v-close-popup />
          <q-btn @click="editProfile('pseudo')" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit.location">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ville</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <search-city :cityProp="city" :error="cityError" @city_selected="selectCity" @clear="clearLocation" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" color="grey-8" no-caps v-close-popup />
          <q-btn @click="editLocation" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit.avatar">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Avatar</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-uploader
            style="width: 95%"
            hide-upload-btn
            @added="fileIsAdded"
            :multiple="false"
            :factory="upload"
            accept=".jpg, image/*"
            @rejected="onRejected"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" no-caps color="grey-8" v-close-popup />
          <q-btn @click="editAvatar" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <!-- <q-card class="my-card">
        <q-card-section v-if="!avatar || !instruments">
        Avant de commencer, merci de compléter ton profile (au moins l'avatar et l'instrument)
        </q-card-section>
      </q-card> -->
    </div>
    <div class="row q-mt-md q-mb-md">
      <div class="col">
        <q-list class="bg-white">
          <q-item>
            <q-item-section>
              <q-item-label caption>Pseudo :</q-item-label>
              <q-item-label>{{ profile.pseudo }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.pseudo = true"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Ville :</q-item-label>
              <q-item-label>
                {{ profile.locality && profile.area_level_2 ? `${profile.locality} - ${profile.area_level_2}` : '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.location = true"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Avatar</q-item-label>
              <q-item-label>
                <q-avatar size="70px" v-if="profile.avatar">
                  <img :src="profile.avatar.url">
                  <!-- <q-btn round color="red" icon="fas fa-trash" size="sm" @click="avatar = undefined" style="position: absolute; right: 1px; top: 1px" /> -->
                </q-avatar>
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.avatar = true"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Instruments</q-item-label>
              <q-item-label>
                <ul>
                  <li v-for="instrument in profile.instruments" :key="instrument.id">
                    {{ instrument.nom }}
                  </li>
                </ul>
              </q-item-label>
            </q-item-section>
            <!-- <q-item-section side top>
              <q-item-label caption>Edit</q-item-label>
            </q-item-section> -->
          </q-item>
          <q-separator spaced />
        </q-list>
      </div>
    </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import SearchCity from 'src/components/SearchCity.vue'

export default {
  components: { SearchCity },
  name: 'profile',
  data: () => ({
    city: undefined,
    location: {
      place_id: '',
      name: '',
      type: '',
      country: ''
    },
    cityError: false,
    profileCopy: undefined,
    edit: {
      pseudo: false,
      avatar: false,
      location: false
    },
    cityModel: {
      nom: undefined,
      codeDepartement: undefined
    },
    cityOptions: undefined,
    pseudo: '',
    commune: '',
    avatar: undefined,
    file: '',
    instrumentsList: [],
    instrumentFullList: undefined,
    instruments: []
  }),
  computed: {
    ...mapState('main', ['profile'])
  },
  methods: {
    editLocation () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`profiles/location/${this.profile.id}`, {
        place_id: this.location.place_id
      })
        .then(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.getProfileData()
        })
        .catch(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'negative',
            message: 'server error'
          })
        })
    },
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
    editProfile (el) {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`profiles/${this.profile.id}`, {
        [el]: this.profileCopy[el]
      })
        .then(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.getProfileData()
        })
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
    getProfileData () {
      this.instruments = []
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store.dispatch('main/getMyProfile', {
        profileId: this.$q.cookies.get('profile_id')
      })
        .then(r => {
          this.profileCopy = { ...r.data }
          this.$store.dispatch('main/changeLoadingState', false)
        })
    },
    getInstruments () {
      this.$store.dispatch('main/getInstruments')
        .then(r => {
          this.instrumentFullList = r.data
          r.data.map(el => {
            this.instrumentsList.push(el.nom)
          })
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
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }
  },
  mounted () {
    this.getProfileData()
    // this.getInstruments()
  }
}
</script>
