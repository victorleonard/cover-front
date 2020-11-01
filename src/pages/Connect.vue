<template>
<q-page class="welcome fit column wrap justify-center items-center content-center" style="background-color: #FAFAFA;">
<q-btn v-go-back=" '/' " align="right" class="go-back absolute-top-left" icon="fas fa-chevron-left" no-caps flat label="Back" />
  <div class="row">
    <img class="logo" src="https://cover.s3.eu-west-3.amazonaws.com/cover_28108a73e4.png" alt="">
  </div>
  <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
    <form @submit.prevent="connect" class="q-pa-md">
    <q-input v-model="form.email" type="email" label="Email" />
    <q-input v-model="form.password" type="password" label="Mot de passe" />
    <div class="row justify-start" style="align-items: baseline">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Connexion"
        class="q-mt-md"
        color="brand"
      >
        <template v-slot:loading>
          <q-spinner-puff
        />
        </template>
      </q-btn>
      <q-btn to="register" no-caps label="Inscription" flat />
    </div>
    <div class="q-mt-xl row">
      <router-link to="forgot-password" class="forgot-password-link">
        Mot de passe oublié ?
      </router-link>
    </div>
    </form>
  </div>
</q-page>
</template>

<script>
// import UserService from '../services/UserService'
export default {
  name: 'connect',
  data () {
    return {
      submitting: false,
      form: {
        email: '',
        password: ''
      },
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    connect () {
      this.submitting = true
      this.$store.dispatch('main/changeLoadingState', true)
      localStorage.removeItem('token')
      this.$store
        .dispatch('main/connectUser', {
          email: this.form.email,
          password: this.form.password
        })
        .then(resp => {
          this.submitting = false
          this.$store.dispatch('main/getMe')
            .then(me => {
              console.log('me', me)
              this.$store.dispatch('main/changeLoadingState', false)
              this.$router.push({
                name: 'home'
              })
            })
        })
        .catch(error => {
          this.submitting = false
          console.log(error.response)
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.dialog({
            title: 'Error',
            message: error.response.data.data[0].messages[0].message
          })
        })
    },
    identify (user) {
      this.tempUser = user
      this.modal = true
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

<style lang="scss" scoped>
  .forgot-password-link {
    color: rgb(44, 62, 80);
    text-decoration: none;
    font-weight: 500;
  }
</style>
