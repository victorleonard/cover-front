<template>
  <q-page padding>
    <div class="row">
      <div>Bonjour {{ profile.pseudo }} </div>
    </div>
    <div class="row">
      <p class="text-body1">Joindre ou créer un groupe</p>
    </div>
    <div class="row">
      <q-btn class="q-mr-xl" to="group-creation" label="Créer"  />
    </div>
    <div class="row q-pt-md">
      <q-card v-for="group in myGroups" :key="group.id" class="my-card" style="width: 100%">
      <q-img src="http://localhost:1337/uploads/group_no_image_1b4265dd37.jpg">
        <div class="absolute-bottom">
          <div class="text-h6">{{ group.name }}</div>
          <!-- <div class="text-subtitle2">by John Doe</div> -->
        </div>
      </q-img>

      <q-card-actions>
        <q-btn flat>Rejoindre</q-btn>
      </q-card-actions>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState('main', ['profile', 'user', 'myGroups'])
  },
  methods: {
    getMe () {
      this.$store.dispatch('main/getMe')
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getMyGroups')
  }
}
</script>
