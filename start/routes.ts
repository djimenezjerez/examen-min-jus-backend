import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'AuthController.login')

    Route.group(() => {
      Route.post('logout', 'AuthController.logout')

      Route.group(() => {
        Route.resource('roles', 'RolesController')
        Route.resource('usuarios', 'UsuariosController')
      }).middleware(['rol:ADMINISTRADOR'])
    }).middleware('auth')
  }).prefix('/v1')
}).prefix('/api')
