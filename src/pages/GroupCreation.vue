<template>
  <q-page padding>
    <div class="row">
      <h6>Group creation</h6>
    </div>
    <div class="row">
      <div class="col">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="name"
            label="Name *"
            hint="Nom du groupe"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'group-creation',
  data: () => ({
    name: ''
  }),
  computed: {
    ...mapState('main', ['profile', 'user'])
  },
  methods: {
    async onSubmit () {
      try {
        await this.$store.dispatch('main/createGroup', {
          name: this.name
        })
        this.$q.notify({
          type: 'positive',
          message: 'Le groupe a été créé',
          position: 'top'
        })
        this.$store.dispatch('main/getMe')
          .then(() => {
            this.$router.push({
              name: 'home'
            })
          })
      } catch (e) {
        this.$store.dispatch('main/changeLoadingState', false)
        this.$q.notify({
          type: 'negative',
          message: e.response.data.message,
          position: 'top'
        })
      }
    },
    onReset () {
      this.name = ''
    }
  }
}
</script>
