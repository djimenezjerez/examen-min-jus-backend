import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'AuthController.login')

    Route.group(() => {
      Route.post('logout', 'AuthController.logout')
    }).middleware('auth')
  }).prefix('/v1')
}).prefix('/api')
