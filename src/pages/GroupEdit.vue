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
            <q-btn label="Change" type="submit" color="primary"/>
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
  name: 'group-edit',
  data: () => ({
    name: ''
  }),
  computed: {
    ...mapState('main', ['profile', 'user'])
  },
  methods: {
    getGroupData () {
      this.$store.dispatch('main/getGroup', {
        groupId: this.$route.params.groupId
      })
        .then(r => {
          const d = r.data
          this.name = d.name
        })
    },
    async onSubmit () {
      try {
        await this.$store.dispatch('main/updateGroup', {
          groupId: this.$route.params.groupId,
          name: this.name
        })
        this.$q.notify({
          type: 'positive',
          message: 'Le groupe a été modifié',
          position: 'top'
        })
        this.$store.dispatch('main/getMe')
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
      this.getGroupData()
    }
  },
  mounted () {
    this.getGroupData()
  }
}
</script>
