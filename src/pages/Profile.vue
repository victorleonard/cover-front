<template>
<q-page padding>
    <div class="row">
      <div class="col">
      <h4 class="q-mt-md q-mb-md">Ton Profile</h4>
      </div>
    </div>
    <div class="row q-mt-md q-mb-md">
      <div class="col">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
        <q-input v-model="pseudo" label="pseudo" />
        <q-input v-model="commune" label="Commune" />
        <q-select
          v-model="instruments"
          multiple
          :options="instrumentsList"
          label="Instruments"
          style="width: 250px"
        />
        <q-btn @click="manageProfile" :disable="profile && pseudo === profile.pseudo" color="white" text-color="black" label="Save" />
        </q-form>
      </div>
    </div>
    <div class="row">
    </div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'profile',
  data: () => ({
    pseudo: '',
    commune: '',
    instrumentsList: [],
    instruments: []
  }),
  computed: {
    ...mapState('main', ['profile'])
  },
  methods: {
    onSubmit () {},
    onReset () {},
    manageProfile () {
      if (this.profile) {
        this.$store.dispatch('main/updateProfile', {
          pseudo: this.pseudo
        })
      } else {
        this.$store.dispatch('main/createProfile', {
          pseudo: this.pseudo
        })
      }
    }
  },
  mounted () {
    if (this.profile) {
      this.pseudo = this.profile.pseudo
      this.commune = this.profile.commune
      this.profile.instruments.map(el => {
        this.instruments.push(el.nom)
      })
      this.$store.dispatch('main/getInstruments')
        .then(r => {
          r.data.map(el => {
            this.instrumentsList.push(el.nom)
          })
        })
    }
  }
}
</script>
