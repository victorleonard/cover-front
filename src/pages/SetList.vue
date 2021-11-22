<template>
<q-pull-to-refresh @refresh="refresh">
  <q-page padding class="search-page q-pl-md q-pr-md">
    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <q-toolbar class="q-mb-sm">
      <q-toolbar-title>
        Setlist
      </q-toolbar-title>
      <q-btn flat round dense icon="eva-share" @click="share" />
    </q-toolbar>
      <div>
        <div class="row">
          <q-card v-for="song in setlist" class="q-mb-md" :key="song.id">
            <q-card-section class="q-pa-none">
              <div class="row items-center bg-grey-1">
                <div class="col col-3 col-md-6">
                  <img style="max-width: 100%; display: block" :src="song.images[0].url" alt="">
                </div>
                <div class="col q-pr-sm" style="line-height: 1.2rem">
                    <div class="text-grey-9 q-title q-ml-sm">{{ song.name }}</div>
                    <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{ song.artist }}</div>
                </div>
                <q-btn flat icon="eva-trash-2-outline" label="" @click="removeToSetList(song.id)" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</q-pull-to-refresh>
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'

export default {
  name: 'SetList',
  data () {
    return {
      setlist: undefined
    }
  },
  computed: {
    ...mapState('main', ['currentGroup'])
  },
  methods: {
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
          copyToClipboard(`http://app.victorleonard/cover3/#/share/${this.$route.params.groupId}`)
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
          location.href = `whatsapp://send?text=Setlist du groupe ${this.currentGroup.name} : http://app.victorleonard/cover3/#/share/${this.$route.params.groupId}`
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
      this.$axios.put(`/songs/${id}`, {
        setlist: false
      })
        .then(() => {
          this.$q.notify({
            message: 'Le titre a été retiré de la setlist',
            type: 'positive',
            position: 'top'
          })
          this.loadSetList()
        })
    },
    loadSetList () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/songs?group=${this.$route.params.groupId}&setlist=true`)
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
