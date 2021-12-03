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
    label="Rechercher un profile"
  >
    <template v-slot:prepend>
      <q-icon name="eva-person-outline" />
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents">
        <q-item-section>
          <q-item-label>{{ `${scope.opt.pseudo}` }}</q-item-label>
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
  name: 'searchUser',
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
          this.$axios.get(`/profiles?pseudo_contains=${val}`)
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
      if (val.pseudo) {
        this.city = `${val.pseudo}`
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
