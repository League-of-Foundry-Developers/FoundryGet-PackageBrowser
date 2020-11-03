<template>
  <div class="v-app">
    <main>
      <Modules />
    </main>
  </div>
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
