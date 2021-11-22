<template>
<q-pull-to-refresh @refresh="refresh" v-if="d">
  <q-card style="min-height: 100vh; max-width: 400px; margin: 0 auto">
    <q-card-section>
      <div class="row">
          <div class="col">
            <q-img
              class="bg-grey-9"
              :src="d.group.logo"
            >
              <div class="text-h4" style="width: 100%">
                <div class="row">
                  <div class="col">
                    {{ d.group.name }}
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
    <q-card v-for="song in d.setlist" class="q-mb-md" :key="song.id">
            <q-card-section class="q-pa-none">
              <div class="row items-center bg-grey-1">
                <div class="col col-3 col-md-6">
                  <img style="max-width: 100%; display: block" :src="song.img" alt="">
                </div>
                <div class="col q-pr-sm" style="line-height: 1.2rem">
                    <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
                    <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ song.artist }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
  </q-card-section>
  </q-card>
</q-pull-to-refresh>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  name: 'SetList',
  data () {
    return {
      d: undefined
    }
  },
  methods: {
    loadSetList () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/songs/share/${this.$route.params.groupId}`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.d = r.data
        })
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
          copyToClipboard(`http://app.victorleonard.fr/cover3/#/${this.$route.params.groupId}`)
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
          location.href = `whatsapp://send?text=Setlist du groupe ${this.d.group.name} : http://app.victorleonard.fr/cover3/#/${this.$route.params.groupId}`
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
