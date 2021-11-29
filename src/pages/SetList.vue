<template>
  <div>
  <q-dialog v-model="dialogAddSong">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Rechercher un titre</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
        filled
          v-model="songSelected"
          :options="songs"
          label=""
          color="teal"
          clearable
          options-selected-class="text-deep-orange"
        >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section avatar>
              <q-img :src="scope.opt.images[0].url" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <q-item-label caption>{{ scope.opt.artist }}</q-item-label>
            </q-item-section>
          </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat no-caps label="Annuler" v-close-popup />
        <q-btn flat no-caps label="Ajouter le titre à la playlist" @click="addSongToSetlist" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-page v-if="setlist" padding class="search-page q-pl-md q-pr-md">
    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <q-toolbar class="q-mb-sm">
      <q-toolbar-title>
        <q-btn :to="{ name: 'setlists' }" flat round dense>
          <q-icon name="eva-chevron-left-outline" />
        </q-btn>
        {{ setlist.name }}
      </q-toolbar-title>
      <q-btn flat round dense icon="eva-plus" @click="addSong" />
      <!-- <q-btn flat round dense icon="eva-share" @click="share" /> -->
    </q-toolbar>
      <div>
        <div class="row">
          <draggable v-model="setlist.songs" group="people" :options="{handle:'.move'}" @end="sortSetList">
            <q-card v-for="song in setlist.songs" class="q-mb-md" :key="song.id">
            <q-card-section class="q-pa-none">
              <div class="row items-center bg-grey-1">
                <div class="col col-auto">
                  <q-btn class="move" flat icon="fas fa-grip-vertical" label=""/>
                </div>
                <div class="col col-3 col-md-6">
                  <img style="max-width: 100%; display: block" :src="song.image_url" alt="">
                </div>
                <div class="col q-pr-sm" style="line-height: 1.2rem">
                    <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
                    <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ song.artist }}</div>
                </div>
                <q-btn flat icon="eva-trash-2-outline" label="" @click="removeToSetList(song.id)" />
              </div>
            </q-card-section>
          </q-card>
          </draggable>
        </div>
      </div>
    </div>
  </q-page>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'
import orderBy from 'lodash/orderBy'
import draggable from 'vuedraggable'

export default {
  name: 'SetList',
  components: { draggable },
  data () {
    return {
      setlist: undefined,
      dialogAddSong: false,
      songs: [],
      songSelected: ''
    }
  },
  computed: {
    ...mapState('main', ['currentGroup'])
  },
  methods: {
    sortSetList () {
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: this.setlist.songs
      })
    },
    addSongToSetlist () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.setlist.songs.push({
        song_id: this.songSelected.id,
        name: this.songSelected.name,
        artist: this.songSelected.artist,
        image_url: this.songSelected.images[0].url
      })
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: this.setlist.songs
      })
        .then(() => {
          this.loadSetList()
        })
    },
    addSong () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/songs?group=${this.$route.params.groupId}&status=accepted`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.songs = orderBy(r.data, ['total'], ['desc'])
          this.songs = r.data.map(s => {
            const sCopy = { ...s }
            sCopy.label = s.name
            sCopy.value = s.id
            return sCopy
          })
          this.dialogAddSong = true
        })
    },
    share () {
      this.$q.bottomSheet({
        message: 'Partager la setlist :',
        actions: [
          {
            label: 'Copier le lien de partage',
            icon: 'far fa-copy',
            id: 'share'
          },
          {
            label: 'Partager via Whatsapp',
            icon: 'fab fa-whatsapp',
            id: 'wa'
          }
        ]
      }).onOk(action => {
        if (action.id === 'share') {
          copyToClipboard(`http://app.victorleonard.fr/cover3/#/share/${this.$route.params.groupId}`)
            .then(() => {
              this.$q.notify({
                message: 'Le lien a été copié',
                type: 'positive',
                position: 'top'
              })
            })
            .catch(() => {
            // fail
            })
        }
        if (action.id === 'wa') {
          location.href = `whatsapp://send?text=Setlist du groupe ${this.currentGroup.name} : http://app.victorleonard.fr/cover3/#/share/${this.$route.params.groupId}`
        }
        // console.log('Action chosen:', action.id)
      }).onCancel(() => {
        // console.log('Dismissed')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    removeToSetList (id) {
      this.$store.dispatch('main/changeLoadingState', true)
      const filterSongs = this.setlist.songs.filter(s => s.id !== id)
      this.setlist.songs = filterSongs
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: filterSongs
      })
        .then(() => {
          this.loadSetList()
        })
    },
    loadSetList () {
      this.$store.dispatch('main/changeLoadingState', true)
      /* this.$axios.get(`/songs?group=${this.$route.params.groupId}&setlist=true`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.setlist = r.data
        }) */
      this.$axios.get(`/setlists/${this.$route.params.id}`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.setlist = r.data
        })
    },
    refresh () {
      console.log('refresh')
    }
  },
  created () {
    this.loadSetList()
  }
}
</script>
