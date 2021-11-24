<template>
  <q-page class="bg-grey-10 welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="~assets/cover_logo.png" style="max-width: 200px" alt="">
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
