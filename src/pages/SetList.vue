<template>
  <div>
  <q-dialog v-model="dialogVideoAdd">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Modifier l'url youtube</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="songSelected.youtube_id" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Annuler" no-caps v-close-popup />
        <q-btn flat label="Mettre à jour" no-caps v-close-popup @click="updateVideo" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogVideo" full-width>
    <q-video :src="`https://www.youtube.com/embed/${songSelected.youtube_id}?rel=0`" :ratio="16/9"/>
  </q-dialog>

  <q-dialog v-model="dialogAddSong">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Rechercher un titre</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
       <!--  <q-select
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
        </q-select> -->
        <search @addSong="addSongToSetlist" />
      </q-card-section>

      <!-- <q-card-actions align="right" class="text-primary">
        <q-btn flat no-caps label="Annuler" v-close-popup />
        <q-btn flat no-caps label="Ajouter le titre à la playlist" @click="addSongToSetlist" v-close-popup />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
  <q-page v-if="setlist" padding class="search-page q-pl-md q-pr-md">
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <q-toolbar class="q-mb-sm">
      <q-toolbar-title>
        <q-btn :to="{ name: 'setlists' }" flat round dense>
          <q-icon name="eva-chevron-left-outline" />
        </q-btn>
        {{ setlist.name }} <span class="text-caption">(durée : {{ duration }})</span>
      </q-toolbar-title>
    </q-toolbar>
    <div class="row">
      <div class="q-mb-md q-ml-auto">
      <q-btn outline class="q-mr-sm" no-caps color="primary" icon="eva-plus" label="Ajouter un titre" @click="addSong" />
      <q-btn outline no-caps icon="eva-share" color="primary" label="Partager" @click="share" />
      </div>
    </div>
        <div class="row">
          <draggable class="full-width" v-model="setlist.songs" group="people" :options="{handle:'.move'}" @end="sortSetList">
            <q-card v-for="song in setlist.songs" class="q-mb-md" :key="song.id">
            <q-card-section class="q-pa-none">
              <div class="row items-center bg-grey-1">
                <div class="col col-1 col-auto" style="width: 40px">
                  <q-btn class="move" flat color="primary" size="xs" icon="fas fa-grip-vertical" label=""/>
                </div>
                <div class="col col-3 col-md-6">
                  <q-img :src="song.image_url" alt="" />
                </div>
                <div class="col q-pr-sm" style="line-height: 1.2rem">
                    <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
                    <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ song.artist }}</div>
                    <div class="text-grey-7 text-caption q-ml-sm q-mt-sm">{{ millisecondsToMinutesSeconds(song.duration_ms) }}</div>
                </div>
                <div class="co col-1">
                <q-btn class="absolute-top-right" color="grey-7" flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable @click="removeToSetList(song.id)">
                        <q-item-section avatar>
                          <q-icon color="red-8" name="eva-trash-2-outline" />
                        </q-item-section>
                        <q-item-section>Supprimer</q-item-section>
                      </q-item>
                      <q-item clickable @click="songSelected = song; dialogVideoAdd = true">
                        <q-item-section avatar>
                          <q-icon color="red-8" name="fab fa-youtube" />
                        </q-item-section>
                        <q-item-section>Ajouter un lien youtube</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn class="absolute-bottom-right" v-if="song.youtube_id" outline @click="dialogVideo = true" size="md" color="red-8" flat icon="fab fa-youtube" />
                  </div>
                <!-- <q-btn flat icon="eva-trash-2-outline" label="" @click="removeToSetList(song.id)" /> -->
              </div>
            </q-card-section>
          </q-card>
          </draggable>
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
import search from './Search.vue'
import moment from 'moment'

export default {
  name: 'SetList',
  components: { draggable, search },
  data () {
    return {
      setlist: undefined,
      dialogAddSong: false,
      songs: [],
      songSelected: '',
      dialogVideo: false,
      dialogVideoAdd: false
    }
  },
  computed: {
    ...mapState('main', ['currentGroup', 'frontHost']),
    duration () {
      if (!this.setlist.songs.length) return
      let total = 0
      this.setlist.songs.forEach(s => {
        total += parseInt(s.duration_ms)
      })

      return this.millisecondsToMinutesSeconds(total)
    }
  },
  methods: {
    extractYoutubeID (url) {
      var ID = ''
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_-]/i)
        ID = ID[0]
      } else {
        return ''
      }
      return ID
    },
    updateVideo () {
      console.log('lk ')
      const setListcopy = { ...this.setlist }
      const findSong = setListcopy.songs.find(s => s.id === this.songSelected.id)
      findSong.youtube_id = this.extractYoutubeID(this.songSelected.youtube_id)
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: setListcopy.songs
      })
        .then(() => {
          this.loadSetList()
          this.dialogAddSong = false
        })
    },
    millisecondsToMinutesSeconds (ms) {
      const duration = moment.duration(ms, 'milliseconds')
      const fromMinutes = Math.floor(duration.asMinutes())
      const fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60)

      return Math.floor(duration.asSeconds()) >= 60 ? (fromMinutes <= 9 ? '0' + fromMinutes : fromMinutes) + ':' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
        : '00:' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
    },
    sortSetList () {
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: this.setlist.songs
      })
    },
    addSongToSetlist (t) {
      this.$store.dispatch('main/changeLoadingState', true)
      this.setlist.songs.unshift({
        song_id: t.id,
        name: t.name,
        artist: t.artists[0].name,
        image_url: t.album.images[1].url,
        duration_ms: t.duration_ms
      })
      this.$axios.put(`setlists/${this.$route.params.id}`, {
        songs: this.setlist.songs
      })
        .then(() => {
          this.loadSetList()
          this.dialogAddSong = false
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
          copyToClipboard(`${this.frontHost}/#/share/${this.$route.params.id}`)
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
          location.href = `whatsapp://send?text=Setlist du groupe ${this.currentGroup.name} : ${this.frontHost}/#/share/${this.$route.params.id}`
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
