<template>
<q-page class="welcome fit column wrap justify-center items-center content-center" style="background-color: #FAFAFA;">
<q-btn v-go-back=" '/connect' " align="right" class="go-back absolute-top-left" icon="fas fa-chevron-left" no-caps flat label="Back" />
  <div class="row">
    <img class="logo" src="https://cover.s3.eu-west-3.amazonaws.com/cover_28108a73e4.png" alt="">
  </div>
  <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
    <form @submit.prevent="resetPassword" class="q-pa-md">
    <q-input v-model="email" type="email" label="Email" />
    <div class="row justify-start" style="align-items: baseline">
      <q-btn
        type="submit"
        label="Envoyer"
        no-caps
        unelevated
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
  name: 'ForgotPassword',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    resetPassword () {
      this.$store.dispatch('main/changeLoadingState', true)
      this.$axios.post('auth/forgot-password', {
        email: this.email
      })
        .then(resp => {
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q
            .dialog({
              title: 'Email envoyé',
              message: 'Un email vous a été envoyé pour réinitialiser votre mot de passe',
              persistent: true
            })
            .onOk(() => {
              this.$router.push({
                name: '/'
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
