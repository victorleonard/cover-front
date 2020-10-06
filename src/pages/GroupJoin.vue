<template>
<q-page padding>
      <div class="row">
        <div class="col">
        <h4 class="q-mt-md q-mb-md">Liste des groupes</h4>
        </div>
      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group-join',
  data: () => ({
    pseudo: ''
  }),
  computed: {
    ...mapState('main', ['groups'])
  },
  beforeCreate () {
    this.$store.dispatch('main/getGroups')
  }
}
</script>
