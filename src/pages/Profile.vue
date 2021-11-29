<template>
<q-page padding v-if="profile && profileCopy">
  <q-dialog v-model="edit.pseudo" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Pseudo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="profileCopy.pseudo" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn @click="editProfile('pseudo')" flat label="Mettre à jour" v-close-popup />
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
              <q-item-label>{{ profile.commune }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>Edit</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Avatar</q-item-label>
              <q-item-label>
                <q-avatar size="70px">
                  <img :src="profile.avatar.url">
                  <!-- <q-btn round color="red" icon="fas fa-trash" size="sm" @click="avatar = undefined" style="position: absolute; right: 1px; top: 1px" /> -->
                </q-avatar>
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>Edit</q-item-label>
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
            <q-item-section side top>
              <q-item-label caption>Edit</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </q-list>
        <!-- <q-form
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
        </q-form> -->
      </div>
    </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'profile',
  data: () => ({
    profileCopy: undefined,
    edit: {
      pseudo: false
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
    editProfile (el) {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`profile/${this.profile.id}`, {
        [el]: this.profileCopy[el]
      })
        .then(() => {
          this.$store.dispatch('main/changeLoadingState', false)
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
    onReset () {}
  },
  mounted () {
    this.getProfileData()
    // this.getInstruments()
  }
}
</script>
