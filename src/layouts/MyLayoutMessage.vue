<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <transition
        mode="out-in"
        appear
        :enter-active-class="`animated ${transitionName}`"
      >
          <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayoutMessage',
  data () {
    return {
      transitionName: ''
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log(to, from)
    if (to.name === 'message') {
      this.transitionName = 'slideInRight'
    } else {
      this.transitionName = 'slideInLeft'
    }
    next()
  },
  beforeCreate () {
    this.$store.dispatch('main/getMe')
    this.$store.dispatch('main/getMyProfile')
  }
}
</script>
