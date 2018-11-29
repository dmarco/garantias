<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      :action="`${getFEDomain}/api/upload-files`"
      accept=" .jpg, .jpeg, .png, .pdf, .doc, .docx"
      :on-preview="fileToPreview"
      :before-remove="beforeRemove"
      :on-remove="fileToRemove"
      :on-success="fileSuccess"
      :on-change="fileChange"
      :file-list="fileList"
      multiple
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Arrastre aquí sus archivos <em>o click para explorar</em></div>
    </el-upload>
    <input type="hidden" v-model="jsonString" name="documentation">
  </div>
</template>

<script>
  
  export default {
    data: () => ({
      fileList: [],
      jsonString: [],
      filesArray: []
    }),
    mounted () {
      if (this.$store.state.formUploadFiles.length > 0) {
        // console.log('Existe Store formUploadFiles')
        this.filesArray = this.$store.state.formUploadFiles
        let arrFilesFromStore = []
        this.filesArray.map(function (value, label) {
          arrFilesFromStore.push({name: value.name})
        })
        this.fileList = arrFilesFromStore
      }
    },
    computed: {
      getFEDomain () {
        return process.env.FRONTEND_DOMAIN
      }
    },
    methods: {
      fileToPreview: function (file) {
        // console.log('Esto hay en el Store', this.$store.state.formUploadFiles)
      },
      beforeRemove: function (file, fileList) {
        return this.$confirm(`Seguro desea eliminar ${file.name}?`)
      },
      fileToRemove: function (file, fileList) {
        let image
        if (file.response) {
          image = file.response.newname
        } else {
          image = file.name
        }
        let formData = {
          file: image
        }
        let formDataURI = Object.keys(formData).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
        }).join('&')
        let config = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        this.$axios.post(process.env.FRONTEND_DOMAIN + '/api/remove-files', formDataURI, config)
          .then((response) => {
            if (response.data.responseStatus === 'success') {
              this.filesArray = this.filesArray.filter(item => item.name !== image)
            }
          })
      },
      fileSuccess: function (file, fileList) {
        this.filesArray.push({name: fileList.response.newname})
      }
    },
    watch: {
      filesArray: function (files) {
        // console.log('watching...', files)
        this.$store.commit('setFormUploadFiles', files)
        this.jsonString = JSON.stringify(files)
      }
    }
  }
</script>

<style>
  
</style>