<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center">
      <q-btn class="q-mb-xl q-mt-xl" unelevated color="brand" icon="add" to="group-creation" label="Créer un nouveau groupe"  />
      <q-btn color="brand" unelevated icon="arrow_right_alt" to="group-join" label="Rejoindre un groupe existant"  />
  </q-page>
</template>

<script>
export default {
  name: 'create-or-join'
}
</script>

<style lang="scss" scoped>
  .welcome {
    background-image: url('/simone-secci-49uySSA678U-unsplash.jpg');
    background-size: cover;
    background-position-x: center;
  }
  .logo {
    filter: invert(1);
  }
</style>
