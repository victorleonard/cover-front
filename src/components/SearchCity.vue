<template>
  <q-select
    bg-color="white"
    outlined
    :loading="searchCityLoading"
    v-model="city"
    use-input
    lazy-rules
    option-label="place_name"
    error-message="Please select something"
    :error="error"
    input-debounce="500"
    :options="optionsCity"
    @filter="filterCityFn"
    @input="setCityModel"
    label="Rechercher"
  >
    <template v-slot:prepend>
      <q-icon name="location_on" />
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents">
        <q-item-section>
          <q-item-label>{{ `${scope.opt.description}` }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon v-if="city" name="close" @click.stop="clearData" class="cursor-pointer" />
    </template>
    <template v-slot:no-option v-if="city && city.length">
      <q-item>
        <q-item-section class="text-grey">
          {{ 't.search_location_no_results' }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>

export default {
  data: () => ({
    searchCityLoading: false,
    city: '',
    optionsCity: []
  }),
  props: {
    error: {
      default: false,
      type: Boolean
    },
    cityProp: {
      default: '',
      type: String
    }
  },
  watch: {
    cityProp () {
      if (this.cityProp) {
        this.city = this.cityProp
      }
    }
  },
  methods: {
    filterCityFn (val, update, abort) {
      update(() => {
        if (val.length) {
          this.searchCityLoading = true
          let type = 'regions'
          if (this.$route.name === 'new_ad') type = 'cities'
          this.$axios.get(`/locations?type=${type}&city=${decodeURIComponent(val)}`)
            .then((resp) => {
              this.optionsCity = resp.data
              this.searchCityLoading = false
              update()
            })
            .catch(e => {
              this.searchCityLoading = false
              console.log(e)
            })
        }
      })
    },
    clearData () {
      this.city = ''
      this.$emit('clear')
    },
    setCityModel (val) {
      if (val.description) {
        this.city = `${val.description}`
        this.$emit('city_selected', val)
      }
    }
  },
  mounted () {
    if (this.cityProp) {
      this.city = this.cityProp
    }
  }
}
</script>
