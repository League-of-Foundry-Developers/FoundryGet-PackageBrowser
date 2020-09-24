<template>
  <v-app>
    <v-main>
      <Modules />
    </v-main>
  </v-app>
</template>
<style lang="scss">
  .v-main {
    background-color: var(--v-secondary-base);
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
