<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
      <q-btn class="q-mb-xl q-mt-xl" no-caps unelevated color="brand" icon="add" to="group-creation" label="Créer un nouveau groupe"  />
      <q-btn color="brand" unelevated no-caps icon="arrow_right_alt" to="group-join" label="Rejoindre un groupe existant"  />
  </q-page>
</template>

<script>
export default {
  name: 'create-or-join'
}
</script>

<style lang="scss" scoped>
  .welcome {
    background-image: url('https://cover.s3.eu-west-3.amazonaws.com/simone_secci_49uy_SSA_678_U_unsplash_7ea4a76ada.jpg');
    background-size: cover;
    background-position-x: center;
  }
  .logo {
    filter: invert(1);
  }
</style>
