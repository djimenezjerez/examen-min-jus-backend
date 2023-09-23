import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Usuario from 'App/Models/Usuario'

export default class extends BaseSeeder {
  public async run () {
    await Usuario.updateOrCreate({
      usuario: 'admin'
    }, {
      password: 'admin',
      nombre: 'Super',
      apellidoPaterno: 'Administrador',
      apellidoMaterno: null,
    })
  }
}
