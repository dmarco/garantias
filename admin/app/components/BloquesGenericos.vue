<template>
  <div>
     <section v-for="section in bloques">
       <TheHighLight :highlight="section"  v-bind:class="[section.mb,section.mt]" v-if="section.acf_fc_layout === 'highlight_section'"/>
       <TheForm :form="section.form" v-bind:class="[section.mb,section.mt]" v-if="section.acf_fc_layout === 'form_section'"/>
    </section>
    </div>
</template>

<script>
  import TheHighLight from '~/components/TheHighLight.vue'
  import TheForm from '~/components/TheForm.vue'
  export default {
    props: {
      bloques: Array
    },
    components: {
      TheHighLight,
      TheForm
    }
  }
</script>

<style lang="scss" scoped>
  @import '~assets/css/vars.scss';
  @import '~assets/css/global.scss';
</style>
