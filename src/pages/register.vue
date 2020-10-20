<template>
  <q-page class="welcome fit column wrap justify-center items-center content-center" style="background-color: #FAFAFA;">
    <q-btn v-go-back=" '/' " align="right" class="go-back absolute-top-left" icon="fas fa-chevron-left" no-caps flat label="Back" />
    <q-btn @click="sendEmailConfirmation" color="brand" no-caps unelevated label="Valider" />
      <q-form
      @submit="register"
      class="q-gutter-md"
      style="width: 500px; max-width: 90vw;"
      >
        <q-input
          v-model="form.userName"
          label="Pseudo"
          :rules="[ val => val && val.length > 0 || 'Veuillez saisir un pseudo']"
        />

        <q-input
          v-model="form.email"
          type="email"
          label="Email"
          :rules="[ val => val && val.length > 0 || 'Veuillez saisir un email']"/>

        <q-input
          v-model="form.password"
          type="password"
          label="Mot de passe"
          :rules="[ val => val && val.length > 0 || 'Veuillez saisir un mot de passe']"
        />

        <q-input
          v-model="form.passwordConf"
          type="password"
          label="Confirmer le mot de passe"
          :rules="[ val => val && val.length > 0 || 'Veuillez confirmer votre mot de passe']"
        />
        <q-btn type="submit" color="brand" no-caps unelevated label="Valider" />
      </q-form>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        userName: 'Victor',
        email: 'vicleonard@yahoo.fr',
        password: 'azerty',
        passwordConf: 'azerty'
      },
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    sendEmailConfirmation () {
      axios.post('https://cover-mobile.herokuapp.com/auth/send-email-confirmation', {
        email: this.form.email
      })
    },
    register () {
      if (this.form.password === this.form.passwordConf) {
        this.$store.dispatch('main/changeLoadingState', true)
        this.$store
          .dispatch('main/register', {
            username: this.form.userName,
            email: this.form.email,
            password: this.form.password
          })
          .then(resp => {
            this.$store.dispatch('main/changeLoadingState', false)
            this.$q
              .dialog({
                title: 'Votre compte a été créé',
                message: 'Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien présent dans cet email pour valider votre compte'
              })
              .onOk(() => {
                this.$router.push({
                  name: 'connect'
                })
              })
              .onCancel(() => {
                // console.log('Cancel')
              })
              .onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
              })
          })
          .catch(error => {
            this.$q.notify({
              type: 'negative',
              message: error.response.data.data[0].messages[0].message,
              position: 'top'
            })
            this.$store.dispatch('main/changeLoadingState', false)
            /* this.$store.dispatch('main/changeLoadingState', false)
            let er = JSON.stringify(error)
            let er2 = JSON.parse(er)
            let messageError = er2.response.data.error.message
            console.log(error['message'], er2.response.data.error.message) */
            /* this.$q.dialog({
              title: 'Error',
              message: messageError
            }) */
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Vous n\'avez pas correctement confirmer votre mot de passe',
          position: 'top'
        })
      }
    },
    identify (user) {
      this.tempUser = user
      this.modal = true
    },
    connect () {
      this.currentUser = this.tempUser._id
      this.currentUserName = this.tempUser.name
      localStorage.setItem('userId', this.tempUser._id)
      localStorage.setItem('userName', this.tempUser.name)
      this.modal = false
      location.reload()
    }
  },
  mounted () {
    /* Api().get('users')
      .then(resp => {
        this.users = resp.data.users
      }) */
  }
}
</script>

<style lang="stylus" scoped>
.q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media
  height : 25vw

.q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media img
  object-fit: cover
  height: 100%
</style>
