import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Usuario from 'App/Models/Usuario'
import Rol from 'App/Models/Rol'

export default class extends BaseSeeder {
  public async run () {
    const rol = await Rol.query().where('nombre', 'ADMINISTRADOR').first()
    if (rol) {
      await Usuario.updateOrCreate({
        usuario: 'admin'
      }, {
        password: 'admin',
        nombre: 'Super',
        rolId: rol.id,
        apellidoPaterno: 'Administrador',
        apellidoMaterno: null,
      })
    }
  }
}
