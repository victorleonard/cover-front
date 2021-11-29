<template>
<q-pull-to-refresh @refresh="refresh">
  <q-dialog v-model="dialogAddSetlist">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Nouvelle Setlist</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input outlined v-model="newSetlist.name" label="Nom" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat no-caps label="Annuler" v-close-popup />
        <q-btn flat no-caps label="Ajouter le titre à la playlist" @click="newSetlistCreation" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-page padding class="search-page q-pl-md q-pr-md">
    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <q-toolbar class="q-mb-sm">
      <q-toolbar-title>
        Setlists
      </q-toolbar-title>
      <q-btn flat round dense icon="eva-plus" @click="dialogAddSetlist = true" />
    </q-toolbar>
        <div class="row">
        <q-list bordered separator class="full-width">
          <q-item v-for="setlist in setlists" :key="setlist.id" class="bg-white" style="padding: 1rem">
            <q-item-section>
              <q-item-label>{{ setlist.name }}</q-item-label>
              <!-- <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label> -->
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn flat icon="eva-external-link-outline" :to="{ name: 'setlist', params: { id: setlist.id } }" />
                <q-btn flat icon="eva-trash-2-outline" label="" @click="deleteSetlist(setlist.id, setlist.name)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</q-pull-to-refresh>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SetLists',
  data () {
    return {
      dialogAddSetlist: false,
      setlists: [],
      newSetlist: {
        name: ''
      }
    }
  },
  computed: {
    ...mapState('main', ['currentGroup'])
  },
  methods: {
    deleteSetlist (id, name) {
      this.$q.dialog({
        title: 'Suppression',
        message: `Voulez vous supprimer la setlist "${name}" ?`,
        cancel: true,
        ok: {
          text: 'oui',
          color: 'negative'
        }
      }).onOk(() => {
        this.$axios.delete(`setlists/${id}`)
          .then(() => {
            this.loadSetLists()
          })
        // console.log('>>>> OK')
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    newSetlistCreation () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.post('setlists', {
        name: this.newSetlist.name,
        group: this.$route.params.groupId
      })
        .then(() => {
          this.loadSetLists()
        })
    },
    loadSetLists () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.get(`/setlists?group=${this.$route.params.groupId}`)
        .then(r => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.setlists = r.data
        })
    },
    refresh () {
      console.log('refresh')
    }
  },
  created () {
    this.loadSetLists()
  }
}
</script>
