<template>
  <q-page padding class="docs-input row justify-center">
    <div class="q-gutter-md" style="width: 500px; max-width: 90vw;">
      <q-input v-model="form.userName" label="Pseudo" />
      <q-input v-model="form.email" type="email" label="Email" />
      <q-input v-model="form.password" type="password" label="Password" />
      <q-input
        v-model="form.passwordConf"
        type="password"
        label="Password confirmation"
      />
      <q-btn @click="register" label="Create" />
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      form: {
        userName: 'vic',
        email: 'vicleonard@yahoo.fr',
        password: 'test',
        passwordConf: 'test'
      },
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    register () {
      if (this.form.password === this.form.passwordConf) {
        this.$store
          .dispatch('main/register', {
            username: this.form.userName,
            email: this.form.email,
            password: this.form.password
          })
          .then(resp => {
            this.$q
              .dialog({
                title: 'Success',
                message: 'Welcome ' + this.form.userName + ' !'
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
            console.log('error !!!', error)
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
        alert('error password confirmation')
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
