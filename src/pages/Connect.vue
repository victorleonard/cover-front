<template>
<q-page class="welcome fit column wrap justify-center items-center content-center" style="background-color: #FAFAFA;">
<q-btn v-go-back=" '/' " align="right" class="go-back absolute-top-left" icon="fas fa-chevron-left" no-caps flat label="Back" />
  <div class="row">
    <img class="logo" src="~assets/cover_logo.png" style="max-width: 200px" alt="">
  </div>
  <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
    <form @submit.prevent="connect" class="q-pa-md">
    <q-input v-model="form.email" outlined type="email" label="Email" />
    <q-input v-model="form.password" class="q-mt-md" outlined type="password" label="Mot de passe" />
    <div class="row justify-start" style="align-items: baseline">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Connexion"
        no-caps
        unelevated
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
      currentUser: '',
      currentUserName: ''
    }
  },
  methods: {
    connect () {
      this.$q.cookies.remove('token')
      this.$q.cookies.remove('user_id')
      this.$q.cookies.remove('profile_id')
      this.submitting = true
      /* this.$store.dispatch('main/changeLoadingState', true) */
      // localStorage.removeItem('token')
      this.$store
        .dispatch('main/connectUser', {
          email: this.form.email,
          password: this.form.password
        })
        .then(resp => {
          this.submitting = false
          this.$q.cookies.set('token', resp.data.jwt, {
            expires: 360
          })
          this.$q.cookies.set('user_id', resp.data.user.id, {
            expires: 360
          })
          // creation new profile if not
          if (!resp.data.user.profile) {
            this.$axios.post('/profiles', {
              user: resp.data.user.id,
              pseudo: resp.data.user.username
            })
              .then((res) => {
                this.$q.cookies.set('profile_id', res.data.id, {
                  expires: 360
                })
                this.$store.dispatch('main/getMe')
                  .then(me => {
                    console.log('me', me)
                    /* this.$store.dispatch('main/changeLoadingState', false) */
                    this.$router.push({
                      name: 'home'
                    })
                  })
              })
          } else {
            this.$q.cookies.set('profile_id', resp.data.user.profile.id, {
              expires: 360
            })
            this.$store.dispatch('main/getMe')
              .then(me => {
                console.log('me', me)
                /* this.$store.dispatch('main/changeLoadingState', false) */
                this.$router.push({
                  name: 'home'
                })
              })
          }
        })
        .catch(error => {
          this.submitting = false
          console.log(error.response)
          /* this.$store.dispatch('main/changeLoadingState', false) */
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
    this.$axios.get('/version')
    // this.$store.dispatch('main/getVersion')
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
