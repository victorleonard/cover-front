<template>
<q-page padding v-if="currentGroup && currentGroupCopy">
  <q-dialog v-model="edit.name">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nom</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentGroupCopy.name" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" no-caps color="grey-8" v-close-popup />
          <q-btn @click="editName" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit.location">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Lieu de répèt</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <search-city :cityProp="city" :error="cityError" @city_selected="selectCity" @clear="clearLocation" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" no-caps color="grey-8" v-close-popup />
          <q-btn @click="editLocation" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit.avatar">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Image</div>
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
          <q-btn @click="editImage" unelevated no-caps color="brand" label="Mettre à jour" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
    </div>
    <div class="row q-mt-md q-mb-md">
      <div class="col">
        <q-list class="bg-white">
          <q-item>
            <q-item-section>
              <q-item-label caption>Nom :</q-item-label>
              <q-item-label>{{ currentGroup.name }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.name = true" />
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Ville / lieu de répète :</q-item-label>
              <q-item-label>
                {{ currentGroup.locality && currentGroup.area_level_2 ? `${currentGroup.locality} - ${currentGroup.area_level_2}` : '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.location = true" />
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item>
            <q-item-section>
              <q-item-label caption>Image</q-item-label>
              <q-item-section thumbnail>
                <!-- <q-avatar size="150px" v-if="currentGroup.image">
                  <img :src="currentGroup.image.url">
                </q-avatar> -->
                <img style="width: 300px; height: auto" v-if="currentGroup.image" class="q-mt-md bg-grey-9" :src="currentGroup.image.url" />
              </q-item-section>
            </q-item-section>
            <q-item-section side top>
              <q-btn icon="eva-edit" flat no-caps caption @click="edit.avatar = true" />
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </q-list>
      </div>
    </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import SearchCity from 'src/components/SearchCity.vue'

export default {
  components: { SearchCity },
  name: 'group-edit',
  data: () => ({
    edit: {
      location: false,
      name: false,
      avatar: false
    },
    city: undefined,
    location: {
      place_id: '',
      name: '',
      type: '',
      country: ''
    },
    cityError: false,
    currentGroup: undefined,
    currentGroupCopy: undefined,
    newMember: false,
    name: '',
    file: '',
    score: 0,
    image: undefined,
    users: undefined,
    usersList: undefined
  }),
  computed: {
    ...mapState('main', ['profile', 'user'])
  },
  methods: {
    editLocation () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`groups/location/${this.$route.params.groupId}`, {
        place_id: this.location.place_id
      })
        .then(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.getGroupData()
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
    editImage () {
      this.$store.dispatch('main/changeLoadingState', true)
      const formData = new FormData()
      formData.append('files', this.file)
      this.$axios.post('https://cover-mobile.herokuapp.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(r => {
          this.$axios.put(`groups/${this.$route.params.groupId}`, {
            image: r.data[0].id
          })
            .then(() => { this.getGroupData() })
        })
        .catch(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'negative',
            message: 'server error'
          })
        })
    },
    editName () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.put(`groups/${this.$route.params.groupId}`, {
        name: this.currentGroupCopy.name
      })
        .then(() => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.getGroupData()
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'server error'
          })
          this.$store.dispatch('main/changeLoadingState', false)
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
    getGroupData () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`groups/${this.$route.params.groupId}`)
        .then(res => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.currentGroup = res.data
          this.currentGroupCopy = { ...res.data }
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'server error'
          })
          this.$store.dispatch('main/changeLoadingState', false)
        })
    },
    /* async onSubmit () {
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
    }, */
    onReset () {
      this.getGroupData()
    }
  },
  mounted () {
    this.getGroupData()
  }
}
</script>
