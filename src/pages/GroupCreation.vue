<template>
  <q-page padding>
    <div class="row">
      <h6 class="q-mt-xs q-mb-lg">Nouveau groupe</h6>
    </div>
    <div class="row">
      <div class="col">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="name"
            label="Nom *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-separator />
          <div>Lieu de répète : </div>
          <q-select
              filled
              v-model="cityModel"
              use-input
              hide-selected
              fill-input
              input-debounce="600"
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
          <q-separator />
          <div>Image : </div>
          <div v-if="image" class="relative-position">
            <q-img
              :src="image.url"
              spinner-color="white"
            />
            <q-btn round color="red" icon="close" size="xs" @click="image = undefined" style="position: absolute; right: 5px; top: 5px" />
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
            <q-btn label="Créer" type="submit" color="brand"/>
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
    async onSubmit () {
      try {
        if (this.file) {
          console.log('upload File !')
          this.$store.dispatch('main/upload', {
            file: this.file
          })
            .then(r => {
              // name, commune, codeDepartement, codeRegion, image
              this.$store.dispatch('main/createGroup', {
                name: this.name,
                commune: this.cityModel.nom,
                codeDepartement: this.cityModel.codeDepartement,
                codeRegion: this.cityModel.codeRegion,
                image: r[0].id,
                country: 'FR'
              })
                .then(() => {
                  this.$q
                    .dialog({
                      title: 'Groupe créé',
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
          console.log('no image')
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
