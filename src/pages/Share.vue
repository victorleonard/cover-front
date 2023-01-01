<template>
<div>
  <q-dialog v-model="dialogVideo" full-width>
    <q-video v-if="songSelected" :src="`https://www.youtube.com/embed/${songSelected.youtube_id}?rel=0`" :ratio="16/9" />
  </q-dialog>

<q-pull-to-refresh @refresh="refresh" v-if="d">
  <q-card style="min-height: 100vh; max-width: 400px; margin: 0 auto">
    <q-card-section>
      <div class="row">
          <div class="col">
            <q-img
              class="bg-grey-9"
              :src="d.group.image.url"
            >
              <div class="text-h4" style="width: 100%">
                <div class="row">
                  <div class="col">
                    {{ d.group.name }}<br>
                  <div class="text-caption">Durée : {{ duration }}</div>
                  </div>
                  <div class="col col-auto">
                    <q-btn flat round dense icon="eva-share" @click="show()" />
                  </div>
                </div>
              </div>
            </q-img>
          </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-card v-for="song in d.songs" class="q-mb-md" :key="song.id">
        <q-card-section class="q-pa-none">
          <div class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <q-img :src="song.image_url" alt="" />
            </div>
            <div class="col q-pr-sm" style="line-height: 1.2rem">
              <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
              <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ song.artist }}</div>
            </div>
            <div  v-if="song.youtube_id" class="col col-3">
              <q-btn flat @click="songSelected = song; dialogVideo = true" class="q-ml-sm" size="lg" color="negative"
              no-caps icon="fab fa-youtube" />
            </div>

          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</q-pull-to-refresh>
</div>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'SetList',
  data () {
    return {
      dialogVideo: false,
      songSelected: undefined,
      d: undefined
    }
  },
  computed: {
    ...mapState('main', ['frontHost']),
    duration () {
      if (!this.d.songs.length) return
      let total = 0
      this.d.songs.forEach(s => {
        total += parseInt(s.duration_ms)
      })

      return this.millisecondsToMinutesSeconds(total)
    }
  },
  methods: {
    millisecondsToMinutesSeconds (ms) {
      const duration = moment.duration(ms, 'milliseconds')
      const fromMinutes = Math.floor(duration.asMinutes())
      const fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60)

      return Math.floor(duration.asSeconds()) >= 60 ? (fromMinutes <= 9 ? '0' + fromMinutes : fromMinutes) + ':' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
        : '00:' + (fromSeconds <= 9 ? '0' + fromSeconds : fromSeconds)
    },
    loadSetList () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/setlists/${this.$route.params.id}`)
        .then(r => {
          console.log(r.data)
          this.$store.dispatch('main/changeLoadingState', false)
          this.d = r.data
        })
      /* this.$axios.get(`/songs/share/${this.$route.params.groupId}`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.d = r.data
        }) */
    },
    refresh (done) {
      this.$axios.get(`/songs/share/${this.$route.params.groupId}`)
        .then(r => {
          this.d = r.data
          done()
        })
    },
    show (grid) {
      this.$q.bottomSheet({
        message: 'Partager cette page :',
        grid,
        actions: [
          {
            label: 'Copier le lien',
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
          location.href = `whatsapp://send?text=Setlist du groupe ${this.d.group.name} : ${this.frontHost}/#/share/${this.$route.params.id}`
        }
        // console.log('Action chosen:', action.id)
      }).onCancel(() => {
        // console.log('Dismissed')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  created () {
    this.loadSetList()
  }
}
</script>
