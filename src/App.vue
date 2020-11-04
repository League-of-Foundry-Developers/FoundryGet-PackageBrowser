<template>
  <v-app class="ModuleBrowser">
    <v-main>
      <Modules />
    </v-main>
  </v-app>
</template>
<style lang="scss">
  * {
    box-sizing: border-box;
  }
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
