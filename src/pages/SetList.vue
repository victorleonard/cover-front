<template>
<q-pull-to-refresh @refresh="refresh">
  <q-page padding class="search-page q-pl-md q-pr-md">
    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="text-transform: uppercase;">SetList</div>
      <hr>
    </div>
  </q-page>
</q-pull-to-refresh>
</template>

<script>

export default {
  name: 'SetList',
  data () {
    return {}
  },
  methods: {
    refresh () {
      console.log('refresh')
    }
  }
}
</script>
