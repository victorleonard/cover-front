<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="/cover.png" alt="">
    </div>
    <div class="q-mt-xl">
      <q-btn :to="{ name: 'connect' }" icon="fas fa-door-open" outline no-caps unelevated color="brand" text-color="white" label="Enter" />
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
    background-image: url('/nick-moore-5zWN8DTNeVA-unsplash.jpg');
    background-size: cover;
  }
  .logo {
    filter: invert(1);
  }
</style>
