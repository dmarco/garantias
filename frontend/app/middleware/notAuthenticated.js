export default function ({ store, route, redirect }) {
  // If the user is authenticated redirect to
  // If the user is authenticated redirect to home page
  console.log('*******Middleware Auth*******', store.state.auth)
  if (store.state.auth) {
    return redirect('/pasos')
  }
}
