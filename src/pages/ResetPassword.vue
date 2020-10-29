<template>
<q-page class="welcome fit column wrap justify-center items-center content-center" style="background-color: #FAFAFA;">
<q-btn v-go-back=" '/' " align="right" class="go-back absolute-top-left" icon="fas fa-chevron-left" no-caps flat label="Back" />
  <div class="row">
    <img class="logo" src="https://cover.s3.eu-west-3.amazonaws.com/cover_28108a73e4.png" alt="">
  </div>
  <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
    <form @submit.prevent="resetPassword" class="q-pa-md">
    <q-input
          v-model="password"
          type="password"
          label="Mot de passe"
          :rules="[ val => val && val.length > 0 || 'Veuillez saisir un mot de passe']"
        />

        <q-input
          v-model="passwordConfirmation"
          type="password"
          label="Confirmer le mot de passe"
          :rules="[ val => val && val.length > 0 || 'Veuillez confirmer votre mot de passe']"
        />
    <div class="row justify-start" style="align-items: baseline">
      <q-btn
        type="submit"
        label="submit"
        class="q-mt-md"
        color="brand"
      >
      </q-btn>
    </div>
    </form>
  </div>
</q-page>
</template>

<script>
export default {
  name: 'ResetPassword',
  data () {
    return {
      password: '',
      passwordConfirmation: ''
    }
  },
  methods: {
    getUrlParameter (param) {
      const url = new URL(location.href)
      const searchParams = url.searchParams
      console.log(searchParams)
      return searchParams.get(param)
    },
    resetPassword () {
      const code = location.hash.split('=')[1]
      this.$store.dispatch('main/changeLoadingState', true)
      this.$store
        .dispatch('main/resetPassword', {
          code: code,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation
        })
        .then(resp => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q
            .dialog({
              title: 'Mot de passe modifié',
              message: 'Votre mot de passe a bien été modifié'
            })
            .onOk(() => {
              this.$router.push({
                name: 'connect'
              })
            })
        })
        .catch(error => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.dialog({
            title: 'Error',
            message: error.response.data.data[0].messages[0].message
          })
        })
    }
  }
}
</script>
