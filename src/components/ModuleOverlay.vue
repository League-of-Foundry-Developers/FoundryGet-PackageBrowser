<template>
  <v-overlay :value="overlayState">
    <v-card
      v-click-outside="closeOverlay"
    >
      <v-card-title>Settings</v-card-title>
      <v-btn
        v-bind:overlayState="overlayState"
        v-on:click="closeOverlay"
      >
							Close
      </v-btn>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: "ModuleOverlay",
  components: {},
  props: {
    overlayState: Boolean
  },
  data: () => ({
  }),
  methods: {
    closeOverlay() {
      this.$emit('click', !this.overlayState)
    }
  },
  mounted() {

  }
}
</script>

<style>

</style>
