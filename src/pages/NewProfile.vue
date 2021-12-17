<template>
<q-page padding>
    <div class="row">
      <q-card flat class="bg-brand text-white full-width">
        <q-card-section>
        Avant de commencer, merci de compléter ton profile
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-mt-md q-mb-md overflow-hidden">
      <div class="col">
        <q-list class="bg-white">
          <q-form
            @submit="!form.pseudoAlreadyError ? onSubmit() : null"
            class="q-gutter-md"
          >
          <q-item>
            <q-item-section>
              <q-item-label caption>Pseudo :</q-item-label>
              <q-item-label>
                <q-input @blur="checkPseudo" :error="form.pseudoAlreadyError" :rules="[val => !!val || 'Champ obligatoire']" outlined v-model="form.pseudo" autofocus>
                  <template v-slot:error>
                    Ce pseudo est déjà pris
                  </template>
                </q-input>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-item-label caption>Ville :</q-item-label>
              <q-item-label>
                <search-city :cityProp="city" :error="cityError" @city_selected="selectCity" @clear="clearLocation" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-item-label caption>Avatar</q-item-label>
              <q-item-label>
                <q-uploader
                  unelevated
                  style="width: 100%"
                  color="grey-8"
                  label="Uploader une image"
                  square
                  flat
                  hide-upload-btn
                  @added="fileIsAdded"
                  :multiple="false"
                  :factory="upload"
                  accept=".jpg, image/*"
                  @rejected="onRejected"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- <q-item>
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
          </q-item>
          <q-separator spaced /> -->
          <q-item>
            <q-btn color="brand" type="submit" unelevated label="Enregistrer" />
          </q-item>
          </q-form>
        </q-list>
      </div>
    </div>
</q-page>
</template>

<script>
import axios from 'axios'
import SearchCity from 'src/components/SearchCity.vue'

export default {
  components: { SearchCity },
  name: 'profile',
  data: () => ({
    form: {
      pseudo: '',
      pseudoAlreadyError: false,
      file: ''
    },
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
    instrumentsList: [],
    instrumentFullList: undefined,
    instruments: []
  }),
  methods: {
    checkPseudo () {
      this.$axios.get(`profiles?filters[pseudo][$eq]=${this.form.pseudo}`)
        .then(res => {
          console.log(res)
          if (res.data.data.length) {
            console.log('ho yeah')
            this.form.pseudoAlreadyError = true
          } else {
            this.form.pseudoAlreadyError = false
          }
        })
    },
    onSubmit () {
      console.log('submit')
      if (this.form.file) {
        const formData = new FormData()
        formData.append('files', this.form.file)
        this.$axios.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(r => {
            this.$axios.post('profiles', {
              pseudo: this.form.pseudo,
              place_id: this.location.place_id,
              avatar: r.data[0].id
            })
              .then(() => {
                this.$router.push({ name: 'home' })
              })
          })
      } else {
        this.$axios.post('profiles', {
          pseudo: this.form.pseudo,
          place_id: this.location.place_id
        })
          .then(() => {
            this.$router.push({ name: 'home' })
          })
      }
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
      this.form.file = file[0]
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
  }
}
</script>
