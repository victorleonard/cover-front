<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="https://cover.s3.eu-west-3.amazonaws.com/cover_28108a73e4.png" alt="">
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
      <q-card-section>
        Votre email a bien été validé. Vous pouvez vous connecter
      </q-card-section>
    </q-card>
    </div>
    <div class="q-mt-xl">
      <q-btn :to="{ name: 'connect' }" icon="fas fa-door-open" no-caps unelevated color="brand" text-color="white" label="Connexion" />
      <!-- <q-btn class="q-ml-sm" :to="{ name: 'register' }" unelevated color="white" text-color="white" flat no-caps label="Inscription" /> -->
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'EmailConfirmation'
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
