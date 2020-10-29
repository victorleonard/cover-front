<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="https://cover.s3.eu-west-3.amazonaws.com/cover_28108a73e4.png" alt="">
    </div>
    <div class="q-mt-xl">
      <q-btn :to="{ name: 'home' }" icon="fas fa-door-open" outline no-caps unelevated color="brand" text-color="white" label="Entrer" />
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
    background-image: url('https://cover.s3.eu-west-3.amazonaws.com/bg_home_d164df054e.jpg');
    background-size: cover;
  }
  .logo {
    filter: invert(1);
  }
</style>
