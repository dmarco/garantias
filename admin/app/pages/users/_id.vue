<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 md12>
    <v-form v-model="valid" row lazy-validation ref="form"> 
    <div class="d-block subheading white--text px-4 py-2">Gestión de usuario</div>
      <v-card class="pa-3 mb-1">
        <div class="d-block display-2 black--text mb-3 mt-0 px-2 py-0">{{ user.name }} {{ user.last_name }} 
          <v-chip :color="user.status | statusColor" outline>{{ user.status | statusName }}</v-chip>
        </div>
        <v-card-title class="d-block title mt-3 mb-2 px-2 py-0">Datos personales</v-card-title>
        <v-layout row wrap>
          <v-flex xs6 md6 px-1 class="px-2 mt-4">
            <p>Email: {{ user.email }}</p>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Nombre: {{ user.name }}</p>
          </v-flex>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Apellido: {{ user.last_name }}</p>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Dirección: {{ user.address_street }} {{ user.address_number }}</p>
          </v-flex>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Ciudad: {{ user.city }}</p>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Teléfono: ({{ user.area_code }}) {{ user.phone | phone }}</p>
          </v-flex>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>CUIT: {{ user.cuit_cuil | cuit }}</p>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Sueldo Bruto: {{ user.salary | currency('$', 2, { thousandsSeparator: '.', decimalSeparator: ',' }) }}</p>
          </v-flex>
          <v-flex xs6 md6 px-1 class="px-2">
            <p>Antigüedad: {{ user.antiquity }} Meses</p>
          </v-flex>
        </v-layout>
      </v-card>
  
      <v-card class="pa-3 mb-1">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">Documentación adjunta</v-card-title>
        <v-layout row wrap>
          <v-flex xs12>
            
            <v-flex xs12 md12 px-1 class="px-3" v-for="doc in documents">
              <p class="d-inline-block">
                <v-chip>
                  <v-avatar>
                    <v-icon>attach_file</v-icon>
                  </v-avatar>
                  {{ doc.name }}
                </v-chip>
              </p>
              <v-btn dark round color="primary" :href="`${getFEDomain}/api/file/${doc.name}`" target="_blank">
                <v-icon dark>cloud_circle</v-icon>&nbsp;Ver
              </v-btn>
            </v-flex>
            
          </v-flex>
        </v-layout>
  
      </v-card>
      <v-card class="pa-3 mb-1">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">Datos del alquiler</v-card-title>
        <v-layout row wrap>
          <v-flex xs4 class="px-3 mt-4">
            <p>Duración del Contrato {{ user.contract_period }} meses</p>
            <p>Importe del primer mes {{ user.first_month_amount | currency('$', 2, { thousandsSeparator: '.', decimalSeparator: ',' }) }}</p>
            <p>Monto total del contrato {{ user.total_amount | currency('$', 2, { thousandsSeparator: '.', decimalSeparator: ',' }) }}</p>
          </v-flex>
        </v-layout>
      </v-card>
  
      <v-card class="pa-3 mb-1">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">NOSIS</v-card-title>
        <v-flex xs12 mt-3 px-3>
          <v-checkbox label="Aprobado" v-model="nosis" color="primary"></v-checkbox>
        </v-flex>
      </v-card>
  
      <v-card class="pa-3 mb-1">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">Comentarios</v-card-title>
        <v-flex xs12 mt-3 px-3>
          <v-text-field
            label="Ingrese aquí si tiene alguna objeción sobre esta solicitud"
            textarea
            rows="6"
            auto-grow
            counter=4000
            v-model="comments"
          ></v-text-field>
        </v-flex>
      </v-card>
  
      <v-card class="pa-3 mb-1">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">Estado del trámite</v-card-title>
        <v-flex xs12 mt-3 px-3>
          <v-autocomplete
            :loading="loading"
            :items="statusItems" 
            :rules="[() => statusModel.length > 0 || 'Actualice el estado']"
            :search-input.sync="search" 
            v-model="statusModel" 
            item-text="name"
            item-value="code"
            label="Cambiar estado de solicitud"
            required
          ></v-autocomplete>
        </v-flex>
      </v-card>
      
      <v-card class="pa-3 mb-1" v-if="policy">
        <v-card-title class="d-block title mt-3 mb-2 px-3 py-0">Póliza</v-card-title>
        <v-layout row wrap>
          <v-flex xs12 mt-3 px-3>
            <v-menu
              ref="menu"
              :close-on-content-click="false"
              v-model="menu"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="dateFormatted"
                label="Fecha de expiración de la Póliza"
                prepend-icon="event"
              ></v-text-field>
              <v-date-picker locale="es-AR" v-model="date" no-title @input="menu = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 mt-3 px-3>
            <UploadFilesDragDrop/>
          </v-flex>
        </v-layout>
      </v-card>
 
      <v-layout row class="mb-4 mt-4">
        <v-flex xs12 px-4>
          <!--<v-btn outline outline medium color="white" to="/pasos" >Enviar pedido de contacto</v-btn>-->
          <v-btn outline outline medium color="white" @click="submit" >Guardar</v-btn>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
 
    </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
  import UploadFilesDragDrop from '~/components/UploadFilesDragDrop'
  import status from '~/static/status.json'
  
  export default {
    middleware: 'authenticated',
    async asyncData ({ app, store, params }) {
      let page = await app.$axios.get(`wp/v2/pages?slug=index&_embed`)
      store.commit('setPage', page.data[0])
      store.commit('setObjectForSeo', page.data[0])
      let user = await app.$axios.get(process.env.FRONTEND_DOMAIN + '/api/user-by-id/' + params.id)
      store.commit('setXUser', user.data.user)
    },
    layout (context) {
      return 'admin'
    },
    components: {
      UploadFilesDragDrop
    },
    data: () => ({
      date: null,
      menu: false,
      dateFormatted: null,
  
      nosis: false,
      policy: false,
      statusItems: status,
      comments: '',
      statusModel: '',
      statusRules: [
        v => !!v || 'Actualice el estado'
      ]
    }),
    computed: {
      page () {
        return this.$store.state.page
      },
      user () {
        return this.$store.state.xUser
      },
      documents () {
        let d = JSON.parse(this.$store.state.xUser.documentation)
        return d
      },
      headLess () {
        return this.$store.state.headLess
      },
      getFEDomain () {
        return process.env.FRONTEND_DOMAIN
      }
    },
    head () {
      return {
        title: `${this.$store.state.meta.name}`
      }
    },
    mounted () {
      if (this.$store.state.xUser.policy) {
        this.documentation = this.$store.state.xUser.policy
        this.$store.commit('setFormUploadFiles', JSON.parse(this.documentation))
      }
      if (this.$store.state.xUser.expiration_date) {
        let date = new Date(this.$store.state.xUser.expiration_date)
        let y = date.getUTCFullYear()
        let m = date.getUTCMonth() + 1
        if (m < 10) m = '0' + m
        let d = date.getUTCDate()
        if (d < 10) d = '0' + d
        this.dateFormatted = `${d}/${m}/${y}`
      }
      if (this.$store.state.xUser.nosis) {
        this.nosis = this.$store.state.xUser.nosis
      }
      if (this.$store.state.xUser.status) {
        let status = this.$store.state.xUser.status
        this.statusModel = status
      }
      if (this.$store.state.xUser.comments) {
        this.comments = this.$store.state.xUser.comments
      }
    },
  
    filters: {
      phone (value) {
        value = value.replace(/(\d{4})(\d{4})/, '$1-$2')
        return value
      },
      cuit (value) {
        value = value.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3')
        return value
      },
      statusName (value) {
        return status[Number(value)].name
      },
      statusColor (value) {
        let clr = ''
        if (status[Number(value)].prop === 'error') {
          clr = 'red'
        } else if (status[Number(value)].prop === 'orange') {
          clr = 'orange'
        } else if (status[Number(value)].prop === 'success') {
          clr = 'green'
        }
        return clr
      }
    },
  
    methods: {
  
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
  
      axiosAction: function (URL, formData) {
        let formDataURI = Object.keys(formData).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
        }).join('&')

        let config = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }

        this.$axios.post(process.env.FRONTEND_DOMAIN + URL, formDataURI, config)
          .then((response) => {
            // console.log(response.data)
            this.message = response.data.message
            this.alertType = response.data.responseStatus
            if (response.data.responseStatus === 'danger') {
              window.location.href = '/users#error'
            } else if (response.data.responseStatus === 'success') {
              window.location.href = '/users'
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
  
      submit: function () {
        if (this.$refs.form.validate()) {
          // console.log('statusModel >>>', this.statusModel)
  
          // console.log('>>>', process.env.FRONTEND_DOMAIN)
  
          /*
          * GENERA EL PAGO
          */
          if (this.statusModel === '3') {
            let formData = {
              name: this.user.name,
              last_name: this.user.last_name,
              user_fullname: this.user.name + ' ' + this.user.last_name,
              user_id: this.user._id,
              nosis: this.nosis,
              status: this.statusModel,
              total_amount: this.user.total_amount,
              email: this.user.email,
              comments: this.comments
            }
            this.axiosAction('/api/generate-payment', formData)
  
          /*
          * PAGO Y SE GENERO LA POLIZA
          */
          } else if (this.statusModel === '4') {
            // Tiene que mandar mail con la póliza adjunta
            let formData = {
              user_fullname: this.user.name + ' ' + this.user.last_name,
              email: this.user.email,
              nosis: this.nosis,
              status: this.statusModel,
              comments: this.comments,
              policy: JSON.stringify(this.$store.state.formUploadFiles),
              expiration_date: this.date
            }
            this.axiosAction('/api/update-status-policy', formData)
          } else {
            /*
            * CAMBIO DE ESTADO
            */
            let formData = {
              user_fullname: this.user.name + ' ' + this.user.last_name,
              email: this.user.email,
              nosis: this.nosis,
              status: this.statusModel,
              comments: this.comments
            }
            this.axiosAction('/api/update-status', formData)
          }
        }
      }
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      statusModel: function (val) {
        // console.log('>>>>>>', val)
        if (val === '4') {
          this.policy = true
        } else {
          this.policy = false
        }
      }
    }
  }
</script>
