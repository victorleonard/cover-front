<template>
  <div id="q-app">
    <q-dialog class="q-pa-md q-gutter-sm" v-model="dialog" minimized position="bottom" persistent>
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">Nouvelle mise à jour</div>
            <div class="text-grey">Merci de cliquer sur le bouton pour mettre à jour</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Mettre à jour" unelevated no-caps @click="refresh" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <router-view />
  </div>
</template>
<script>

import { mapState } from 'vuex'

export default {
  name: 'App',
  data: () => ({
    dialog: false
  }),
  computed: mapState('main', ['loading']),
  methods: {
    refresh () {
      this.$q.loading.show()
      location.reload(true)
    },
    checkNewVersion () {
      console.log('check new version')
      this.$axios.get('/version')
        .then(r => {
          const serverVersion = r.data.num_version
          if (!this.$q.cookies.get('version')) {
            this.$q.cookies.set('version', serverVersion)
          } else {
            if (parseFloat(this.$q.cookies.get('version')) !== parseFloat(serverVersion)) {
              this.$q.cookies.set('version', serverVersion)
              this.dialog = true
            }
          }
        })
    }
  },
  watch: {
    loading: function (val) {
      if (val) {
        this.$q.loading.show()
      } else {
        this.$q.loading.hide()
      }
    }
  },
  mounted () {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod/.test(userAgent)
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone)

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode() && this.$route.name !== 'share') {
      this.$q.notify({
        position: 'bottom',
        html: true,
        message: 'Vous pouvez ajouter cette webapp sur votre iphone :<br/> cliquer sur <img src="safari_navigation_action.png" class="q-px-sm"/> puis sur <img src="webapp_install_safari.png" style="max-width: 300px" class="q-py-md q-px-md"/>',
        color: 'grey-7'
      })
    }
    setInterval(() => {
      this.checkNewVersion()
    }, 60000)
  }
}
</script>

<style lang="scss">
#q-app {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #F5F5F5;
}
footer{
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
/* .search-page .q-field--standout.q-field--focused .q-field__control {
  background-color: red !important;
} */
.go-back {
  top: 30px;
}
.text-brand {
  color:#fa886d;
}
.bg-brand {
  background: #fa886d;
}
@media only screen and (min-device-width : 375px) and (max-device-width : 812px) and (-webkit-device-pixel-ratio : 3) {
    .q-tabs-head {
      padding-bottom: 10px !important;
    }
  }
  .q-rating {
    color: #fa886d !important;
  }
  .q-rating i {
    text-shadow: none;
  }
  .q-layout__section--marginal {
    background-color: rgba(255, 255, 255, 0.95);
  }
  /* .q-tabs-row {
    color: #444;
  } */
  /* .q-tab--active {
    color: #fa886d !important;
  } */
  /* .q-tabs {
    color: #444
  } */
  hr {
    height: 1px;
    padding: 0;
    background-color: #aaa;
    border: 0;
  }
  .search-page .q-card {
    background-color: #fafafa;
  }
  .search-page .q-expansion-item__container {
    background-color: #ffffff;
  }
  .search-page .q-expansion-item__content {
    background-color: #fafafa;
    border-top: 1px solid rgba(0,0,0,.1);
  }
  .search-page .q-item-letter {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 3px 0px 0px;
    background: #616161 !important;
    padding: 3px 5px;
    font-size: 12px;
    color: #fff;
  }
  /* .search-page .q-expansion-item .q-expansion-item__container .q-item {
    background-color: #FAFAFA;
    border-top: 1px solid rgba(0,0,0,0.1)
  } */
  .search-page .q-item {
    padding: 0;
    border: none;
  }
  .search-page .q-item-side {
    overflow: hidden;
  }
  .search-page .q-item-main {
    margin-left: -20px;
  }
  /* .search-page .q-item .q-avatar__content img {
    height: 80px;
    widows: 80px;
    object-fit: contain;
    object-position: left;
  } */
  .search-page .q-collapsible {
    margin-bottom: 10px;
  }
  .search-page .q-collapsible-inner {
    background-color: #fff;
  }
  .search-page .q-collapsible-cursor-pointer > .q-collapsible-inner > .q-item {
    padding: 0 !important;
  }
  .search-page .q-collapsible-cursor-pointer > .q-collapsible-inner > .q-item img {
    display: block;
  }
</style>
