<template>
  <v-app class="ModuleBrowser">
    <v-main>
      <Modules />
    </v-main>
  </v-app>
</template>
<style lang="scss">
  .v-card__text {
    width: initial;
  }
</style>
<script>
import Modules from "./components/Modules";

export default {
  name: "App",

  components: {
    Modules
  },

  data: () => ({
    //
  })
};
</script>
