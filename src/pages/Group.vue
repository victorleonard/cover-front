<template>
<q-page padding>
      <div class="row">
        group !
      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group',
  computed: {
    ...mapState('main', ['profile'])
  }
}
</script>
