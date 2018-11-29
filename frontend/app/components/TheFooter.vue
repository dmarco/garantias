<template>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>{{ headLess.acf.copyright }}</div>
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
  .theme--light .footer,
  .application .theme--light.footer {
    background: rgba(245, 245, 245, 0.3);
    color: rgba(0, 0, 0, .87);
  }

  footer {
    p {
      margin: 15px 0;
    }
  }
</style>
