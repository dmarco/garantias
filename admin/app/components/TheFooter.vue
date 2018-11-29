<template>
  <v-footer class="mt-3">
    <p v-html="headLess.acf.copyright"></p>
    
  </v-footer>
</template>
<script>
  export default {
    computed: {
      meta () {
        return this.$store.state.meta
      },
      headLess () {
        return this.$store.state.headLess
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/vars.scss';
  footer {
    p {
      margin: 15px 0;
    }
  }
</style>
