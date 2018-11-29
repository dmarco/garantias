<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12>
      <v-card class="pa-4">
        
        <div style="margin-bottom: 10px">
          <el-row>
            <el-col>
              <el-checkbox-group v-model="filters[0].value" >
                <el-checkbox :label="st.code" v-for="st in status" :class="st.prop" >{{ st.name }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-input v-model="filters[1].value" placeholder="Buscar..."></el-input>
            </el-col>
          </el-row>
        </div>
        <no-ssr>
        <data-tables
          v-loading="loading" 
          :data="warranties" 
          :filters="filters"
          :table-props="tableProps"
          >
          <el-table-column prop="name" label="Apellido, Nombre" sortable="custom" fixed width="180">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.last_name }}, {{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Estado" min-width="240" sortable="custom">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status | statusColor"
                size="small"
                >
                {{ scope.row.status | statusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="nosis" label="Nosis" min-width="100" sortable="custom">
            <template slot-scope="scope">
              <v-icon middle color="green" v-if="scope.row.nosis === true">check</v-icon>
              <v-icon middle color="red" v-if="scope.row.nosis === false">error</v-icon>
            </template>
          </el-table-column>
          <el-table-column prop="cuit_cuil" label="CUIT/CUIL" width="120" :formatter="cuit">
          </el-table-column>
          <el-table-column label="Teléfono" width="130">
            <template slot-scope="scope">
              <i class="el-icon-phone"></i>
              <span style="margin-left: 0px">{{ scope.row.area_code }} {{ scope.row.phone | phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Salary" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <span style="margin-left: 0px" v-if="scope.row.salary">{{ scope.row.salary | currency }}</span>
              <span style="margin-left: 0px" v-else>{{ scope.row.worker_type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_amount" label="Monto Total" min-width="150" sortable="custom" :formatter="currency">
          </el-table-column>
          <el-table-column prop="first_month_amount" label="Alquiler 1er Mes" min-width="160" sortable="custom" :formatter="currency">
          </el-table-column>
          <el-table-column prop="fee_income" label="Cuota:Ingreso" min-width="150" sortable="custom">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.fee_income }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Acción"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="viewRow(scope.$index, warranties)"
                type="primary"
                plain
                icon="el-icon-view"
                size="small">
                Ver
              </el-button>
            </template>
          </el-table-column>
          
        </data-tables>
        </no-ssr>
        
      </v-card>
    </v-flex>
        
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import status from '~/static/status.json'

  export default {
  
    middleware: 'authenticated',
  
    asyncData ({ req, params }) {
      return axios.get(process.env.FRONTEND_DOMAIN + '/api/users-with-warranty')
        .then((res) => {
          return {
            warranties: res.data.warranties,
            loading: false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
  
    layout (context) {
      return 'admin'
    },
  
    components: {
    },
  
    mounted: function () {
      // console.log('warranties', this.warranties)
      // console.log('FRONTEND_DOMAIN', process.env.FRONTEND_DOMAIN)
    },
  
    head () {
      return {
        title: `CYC - ADMIN`
      }
    },
  
    data () {
      return {
        loading: true,
        tableProps: {
          border: false,
          stripe: true
        },
        titles: [
          {
            prop: 'name',
            label: 'Nombre'
          },
          {
            prop: 'last_name',
            label: 'Apellido'
          },
          {
            prop: 'status',
            label: 'Estado'
          },
          {
            prop: 'nosis',
            label: 'NOSIS'
          },
          {
            prop: 'cuit_cuil',
            label: 'CUIT/CUIL'
          },
          {
            prop: ['area_code', 'phone'],
            label: 'Teléfono'
          },
          {
            prop: 'salary',
            label: 'Sueldo Bruto'
          },
          {
            prop: 'total_amount',
            label: 'Monto Total'
          },
          {
            prop: 'first_month_amount',
            label: 'Alquiler 1er mes'
          },
          {
            prop: 'fee_income',
            label: 'Cuota:Ingreso'
          }
        ],
        users: [],
        warranties: [],
        status: status,
        filters: [{
          value: [],
          prop: 'status'
        }, {
          value: '',
          prop: ['name', 'last_name']
        }]
      }
    },
  
    filters: {
      phone (value) {
        value = value.replace(/(\d{4})(\d{4})/, '$1-$2')
        return value
      },
      statusName (value) {
        return status[Number(value)].name
      },
      statusColor (value) {
        let clr = ''
        if (status[Number(value)].prop === 'error') {
          clr = 'danger'
        } else {
          clr = status[Number(value)].prop
        }
        return clr
      }
    },
  
    methods: {
      phone: function (row, column) {
        let value = row.phone.replace(/(\d{4})(\d{4})/, '$1-$2')
        return value
      },
      cuit: function (row, column) {
        let value = row.cuit_cuil.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3')
        return value
      },
      currency: function (row, column, cellValue, index) {
        let amount = '$ ' + cellValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
        return amount
      },
      viewRow: function (index, rows) {
        let ID = rows[index]._id
        // this.$router.push('/users/' + ID)
        window.location.href = '/users/' + ID
      },
      tableRowClassName: function ({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 3) {
          return 'success-row'
        }
        return ''
      }
    }
  
  }
</script>

<style>
  .filters {
    width: 100%;
  }
  .search {
    float: none;
  }
  .el-checkbox-group {
    margin-bottom: 10px;
  }
  .el-checkbox {
    border-radius: 4px;
    padding: .4rem;
    border: 1px solid #dcdfe6;
    color: white;
  }
  .el-checkbox__inner:hover {
    border-color: #ffffff;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #ffffff;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: white;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #585858;
    border-color: #2b2b2b;
  }
  .el-checkbox .el-checkbox__label {
    font-size: 11px;
    padding-left: 5px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 5px;
  }
</style>