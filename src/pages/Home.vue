<template>
  <div>Hello {{ profile.pseudo }} </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState('main', ['profile'])
  }
}
</script>
