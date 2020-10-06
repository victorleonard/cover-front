<template>
  <q-page class="fit column wrap justify-center items-center content-center">
    <div class="row"></div>
    <h5>Bienvenue</h5>
    <div>
      <q-btn :to="{ name: 'connect' }" color="primary" text-color="white" label="Connexion" />
      <q-btn class="q-ml-sm" :to="{ name: 'register' }" color="white" text-color="black" label="Inscripition" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
