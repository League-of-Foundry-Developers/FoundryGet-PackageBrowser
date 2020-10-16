<template>
  <v-overlay :value="overlayState">
    <v-lazy
      transition="fade-transition"
      v-model="isActive"
    >
      <v-card
        v-click-outside="closeOverlay"
        v-if="isActive"
      >
        <header>
          <v-card-title>Settings</v-card-title>
        </header>

        <main class="settingsMain">

          <v-chip
            label
            close
            v-for="apiEntry in apiEntries"
            :key="apiEntry"
            @click:close="removeFromStorage(apiEntry)"
          >
            <v-checkbox
              v-model="apiObject[apiEntry]"
              :key="apiEntry"
              :label="apiEntry"
              v-on:change="(val) => updateStorage(apiEntry, val)"
            ></v-checkbox>
          </v-chip>

          <v-chip
            label
            class="addApiChip"
          >
            <v-btn
              icon
              small
              v-on:click="addApi"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-tooltip
              bottom
              v-model="faultyUrl"
            >
              <template v-slot:activator="{}">
                <v-text-field
                  placeholder="API Url"
                  solo
                  dense
                  single-line
                  background-color="#00000000"
                  flat
                  hide-details
                  v-model="addedUrl"
                ></v-text-field>
              </template>
              <span>Please enter a valid url</span>
            </v-tooltip>
          </v-chip>
        </main>

        <footer>
          <v-btn
            v-bind:overlayState="overlayState"
            v-on:click="closeOverlay"
          >
                  Close
          </v-btn>
        </footer>
      </v-card>
    </v-lazy>
  </v-overlay>
</template>

<script>
export default {
  name: "SettingsOverlay",
  components: {},
  props: {
    overlayState: Boolean
  },

  data: () => ({
    isActive: false,
    trigger: 0,
    addedUrl: "",
    faultyUrl: false
  }),

  methods: {

    closeOverlay() {
      this.$emit('click', !this.overlayState)
    },

    updateStorage(entry, val) {
      let tempObject = localStorage.getObject("apis");
      tempObject[entry] = val;
      localStorage.setObject("apis", tempObject);
      this.trigger++;
    },

    removeFromStorage(entry) {
      let tempObject = localStorage.getObject("apis");
      delete tempObject[entry];
      localStorage.setObject("apis", tempObject);
      this.trigger++;
    },

    addApi() {
      if (/^(ftp|http|https):\/\/[^ "]+$/.test(this.addedUrl)) {
        this.updateStorage(this.addedUrl, true);
        this.faultyUrl = false;
        this.addedUrl = ""
      } else {
        this.faultyUrl = true;
        setTimeout(() => this.faultyUrl = false, 2000)
      }
    }

  },
  computed: {

    apiObject() {
      this.trigger;
      return localStorage.getObject("apis") || {};
    },

    apiEntries() {
      this.trigger;
      return Object.keys(this.apiObject);
    }

  },
  mounted() {
  }
}
</script>

<style>
  .settingsMain {
    display: grid;
    margin: 0 10px 0 10px;
  }
  .settingsMain .v-chip {
    margin: 5px 0 5px 0;
  }
  .settingsMain .v-icon.mdi.mdi-checkbox-marked {
    color: rgb(197 197 197 / 44%) !important;
  }
  .settingsMain .addApiChip .v-chip__content {
    width: 100%;
  }
</style>
