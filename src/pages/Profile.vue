<template>
<q-page padding>
      <div class="row">
        <div class="col">
        <h4 class="q-mt-md q-mb-md">Ton Profile</h4>
        <h6 class="q-mt-md q-mb-md">Complète d'abord ton profile</h6>
        </div>
      </div>
      <div class="row q-mt-md q-mb-md">
        <q-input v-model="pseudo" label="pseudo" />
      </div>
      <div class="row">
        <q-btn @click="manageProfile" :disable="profile && pseudo === profile.pseudo" color="white" text-color="black" label="Save" />
      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'profile',
  data: () => ({
    pseudo: ''
  }),
  computed: {
    ...mapState('main', ['profile'])
  },
  methods: {
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
    }
  }
}
</script>
