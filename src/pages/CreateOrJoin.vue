<template>
  <q-page class="bg-grey-10 welcome fit column wrap justify-center items-center content-center">
    <div class="row">
      <img class="logo" src="~assets/cover_logo.png" style="max-width: 200px" alt="">
    </div>
    <div class="q-mt-xl">
      <div class="row">
        <div class="col q-px-lg">
          <q-btn stack no-caps unelevated size="lg" class="full-width q-mb-lg" color="brand" icon="eva-plus-circle-outline" to="group-creation" label="Créer un nouveau groupe"  />
          <q-btn stack color="brand" unelevated size="lg" class="full-width" no-caps icon="eva-arrow-circle-right-outline" to="group-join" label="Rejoindre un groupe existant"  />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'create-or-join'
}
</script>
