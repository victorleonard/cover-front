<template>
<q-page class="flex flex-center">
  <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
    <q-input v-model="form.email" type="email" label="Email" />
    <q-input v-model="form.password" type="password" label="Password" />
    <q-btn @click="connect" label="Connect" />
    <q-btn to="register" label="Register" flat />
  </div>
</q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
// import UserService from '../services/UserService'
export default {
  name: 'connect',
  data () {
    return {
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
      /* UserService.logIn(this.form.email, this.form.password)
        .then(resp => {
          console.log('resp, resp')
        })
        .catch(error => {
          let er = JSON.stringify(error)
          let er2 = JSON.parse(er)
          console.log(error['message'], er2.response.data.error.message)
        }) */
      this.$store.dispatch('main/changeLoadingState', true)
      localStorage.removeItem('token')
      this.$store
        .dispatch('main/connectUser', {
          email: this.form.email,
          password: this.form.password
        })
        .then(resp => {
          this.$store.dispatch('main/getMe')
            .then(() => {
              this.$store.dispatch('main/changeLoadingState', false)
              this.$router.push({
                name: 'home'
              })
            })
        })
        .catch(error => {
          this.$store.dispatch('main/changeLoadingState', false)
          const er = JSON.stringify(error)
          const er2 = JSON.parse(er)
          const messageError = er2.response.data.error.message
          console.log(error.message, er2.response.data.error.message)
          this.$q.dialog({
            title: 'Error',
            message: messageError
          })
        })
      /* Api().post('/user', {
        'logemail': this.form.logemail,
        'logpassword': this.form.logpassword
      })
        .then(resp => {
          console.log('resp', resp)
        }) */
      /* Api().get('/profile')
        .then(resp => {
          console.log('get profile', resp)
        }) */
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
