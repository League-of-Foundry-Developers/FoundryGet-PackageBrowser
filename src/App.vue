<template>
  <v-app class="ModuleBrowser">
    <v-main>
      <Modules />
    </v-main>
  </v-app>
</template>
<style lang="scss">
  * {
    --primary-color: #555555;
    --secondary-color: #424242;
    --accent-color: #666666;
    --accent-color-light: #848484;

    font-family: sans-serif;
  }
  .v-main, body {
    background-color: var(--secondary-color);
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
