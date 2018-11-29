<template>
  <div class="site" id="site">
    <Spinner1/>
    <div class="interface">
      <v-app>
        <TheHeader class="px-3" />
        <v-content class="content">
          <v-container fluid pa-0>
            <nuxt />
          </v-container>
        </v-content>
          <TheFooter />
      </v-app>
    </div>
  </div>
</template>


<script>
  import Spinner1 from '~/components/Spinner1'
  import TheHeader from '../components/TheHeader'
  import TheFooter from '../components/TheFooter'
  export default {
    data () {
      return {
        clipped: false,
        fixed: false
      }
    },
    components: {
      Spinner1,
      TheHeader,
      TheFooter
    }
  }
</script>


<style lang="scss">
  @import '~assets/css/vars.scss';
  @import '~assets/css/global.scss';

  .application--wrap {
    background: linear-gradient(135deg, rgba(196, 61, 149, 1) 0%, rgba(92, 107, 192, 1) 96%);
  }

  .site * {
    box-sizing: border-box;
    transition-timing-function: cubic-bezier(.11, .89, .31, .99);
  }

  footer {
    justify-content: center;
  }

  .application {
    font-family: $regular;
    line-height: 1.5;
  }


  html {
    box-sizing: border-box;
    font-family: $regular;
    font-size: 16px;
    transition: background-color 0.8s;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-size: 16px;
    font-weight: 300;
    line-height: 20px;
    height: 100%;
    margin: 0;
  }

  #site {
    >.interface {
      opacity: 0;
      overflow: hidden;
    }
    >.spinner {
      display: block;
      left: calc(50% - 20px);
      position: absolute;
      top: calc(50vh - 20px);
      z-index: 10;
    }
  }

  .content {

    margin-top: 130px;
    @media (max-width: 767px) {
      margin-top: 60px
    }
  }

  .overlay--active {
    pointer-events: auto;
    -ms-touch-action: none;
    touch-action: none;
    z-index: 99;
  }

  .img,
  img {
    transition: opacity 1s;
    opacity: 0;
    &[lazy="loaded"] {
      opacity: 1;
    }
  }

  html.wf-active #site {
    >.interface {
      transition: 0.5s;
      opacity: 1;
    }
    >.spinner {
      display: none;
    }
  }

  .lazy {
    position: relative;
    img {
      backface-visibility: hidden;
      height: 100%;
      opacity: 0;
      transition: opacity 1s;
      width: 100%;
    }
    [lazy=loading] {
      opacity: 0;
    }

    [lazy=loaded] {
      opacity: 1;
    }

    [lazy=loading]+.spinner {
      opacity: 1;
    }
    .spinner {
      left: 50%;
      margin: -20px;
      opacity: 0;
      position: absolute;
      top: 50%;
    }
  }
</style>