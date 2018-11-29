export default function ({ store, redirect, app }) {
  // If the user is not authenticated

  // console.log('**** TOKEN:', store.state.auth.accessToken)

  /* let config = {
    headers: { Authorization: 'bearer ' + store.state.auth.accessToken }
  }

  app.$axios.get('https://' + process.env.FRONTEND_DOMAIN + '/api/checktoken', config)
    .then((response) => {
      if (response.data.message === 'Invalid Token') {
        return redirect('/login')
      } else if (response.data.message === 'El token ha expirado') {
        return redirect('/login')
      } else if (response.data.message === 'Tienes acceso') {
        return redirect('/pasos')
      }
    })
    .catch(error => {
      console.log(error)
    }) */

  // console.log('*******Middleware Auth*******', store.state.auth)
  if (!store.state.auth) {
    return redirect('/login')
  }

  // if (window.localStorage.getItem('auth')) {
  // const lsAuth = JSON.parse(this.$localStorage.get('auth'))
  // console.log('**** TOKEN:', lsAuth)
  // }
  // If the user is not authenticated
  // if (!store.state.auth) {
  // return redirect('/login')
  // }
}
