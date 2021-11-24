<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="~assets/cover_logo_full_3.png" style="max-width: 150px" alt="">
    </div>
    <div class="q-mt-xl">
      <q-btn :to="{ name: 'home' }" icon="eva-arrow-right-outline" size="lg" round outline no-caps  color="brand" text-color="white" />
      <!-- <q-btn class="q-ml-sm" :to="{ name: 'register' }" unelevated color="white" text-color="white" flat no-caps label="Inscription" /> -->
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>

<style lang="scss" scoped>
  .welcome {
   /*  background-image: url('https://cover.s3.eu-west-3.amazonaws.com/bg_home_d164df054e.jpg');
    background-size: cover; */
    background-color: rgba(0,0,0,0.9);
  }
</style>
