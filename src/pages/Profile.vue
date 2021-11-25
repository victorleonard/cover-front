<template>
<q-page padding>
    <div class="row">
      <!-- <q-card class="my-card">
        <q-card-section v-if="!avatar || !instruments">
        Avant de commencer, merci de compléter ton profile (au moins l'avatar et l'instrument)
        </q-card-section>
      </q-card> -->
    </div>
    <div class="row q-mt-md q-mb-md">
      <div class="col">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
        <q-input v-model="pseudo" square filled label="pseudo" />
        <p>
        Ville :
        </p>
        <q-select
              square filled
              v-model="cityModel"
              use-input
              hide-selected
              fill-input
              input-debounce="200"
              :options="cityOptions"
              :option-label="opt => cityOptions ? opt.nom + ' - ' + opt.codeDepartement : ' '"
              @filter="filterFn"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
        <q-select
          square filled
          v-model="instruments"
          multiple
          :options="instrumentsList"
          label="Instruments"
          style="width: 95%"
        />
        <p>
        Avatar :
        </p>
        <div v-if="avatar" class="relative-position">
          <q-avatar size="100px">
            <img :src="avatar">
            <q-btn round color="red" icon="fas fa-trash" size="sm" @click="avatar = undefined" style="position: absolute; right: 1px; top: 1px" />
          </q-avatar>
          </div>
          <q-uploader v-else
            style="width: 95%"
            hide-upload-btn
            @added="fileIsAdded"
            :multiple="false"
            :factory="upload"
            accept=".jpg, image/*"
            @rejected="onRejected"
          />
        <q-btn type="submit" unelevated color="brand" label="Sauvegarder" />
        </q-form>
      </div>
    </div>
    <div class="row">
    </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'profile',
  data: () => ({
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
          console.log('rrr', r)
          this.$store.dispatch('main/changeLoadingState', false)
          const p = r.data
          this.pseudo = p.pseudo
          if (p.avatar) {
            this.avatar = p.avatar.url
          }
          if (p.commune) {
            this.commune = p.commune
            this.cityModel.nom = p.commune
            this.cityModel.codeDepartement = p.codeDepartement
          }
          p.instruments.map(el => {
            this.instruments.push(el.nom)
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
    },
    async onSubmit () {
      console.log('submit')
      this.$store.dispatch('main/changeLoadingState', true)
      const instrumentsId = []
      this.instruments.forEach(i => {
        const id = this.instrumentFullList.find(ifl => ifl.nom === i)
        instrumentsId.push(id)
      })
      try {
        if (this.file) {
          this.$store.dispatch('main/upload', {
            file: this.file
          })
            .then(r => {
              this.$store.dispatch('main/updateProfile', {
                pseudo: this.pseudo,
                instruments: instrumentsId,
                avatar: r[0].id,
                commune: this.cityModel ? this.cityModel.nom : '',
                codeDepartement: this.cityModel ? this.cityModel.codeDepartement : '',
                codeRegion: this.cityModel ? this.cityModel.codeRegion : ''
              })
                .then(() => {
                  this.$store.dispatch('main/changeLoadingState', false)
                  this.getProfileData()
                })
            })
        } else {
          await this.$store.dispatch('main/updateProfile', {
            pseudo: this.pseudo,
            name: this.name,
            instruments: instrumentsId,
            commune: this.cityModel ? this.cityModel.nom : '',
            codeDepartement: this.cityModel ? this.cityModel.codeDepartement : '',
            codeRegion: this.cityModel ? this.cityModel.codeRegion : ''
          })
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'positive',
            message: 'Le profile a été mis à jour',
            position: 'top'
          })
          this.getProfileData()
        }
      } catch (e) {
        this.$store.dispatch('main/changeLoadingState', false)
        console.error(e)
        /* this.$q.notify({
          type: 'negative',
          message: e.response.data.message,
          position: 'top'
        }) */
      }
    },
    /* onSubmit () {
      if (this.profile) {
        this.$store.dispatch('main/updateProfile', {
          pseudo: this.pseudo,
          image: r[0].id
        })
      } else {
        this.$store.dispatch('main/createProfile', {
          pseudo: this.pseudo
        })
      }
    }, */
    onReset () {}
  },
  mounted () {
    this.getProfileData()
    this.getInstruments()
    /* if (this.profile) {
      this.pseudo = this.profile.pseudo
      this.commune = this.profile.commune
      this.profile.instruments.map(el => {
        this.instruments.push(el.nom)
      })
      this.$store.dispatch('main/getInstruments')
        .then(r => {
          this.instrumentFullList = r.data
          r.data.map(el => {
            this.instrumentsList.push(el.nom)
          })
        })
    } */
  }
}
</script>
