import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Rol from 'App/Models/Rol'

export default class extends BaseSeeder {
  public async run () {
    const registros = [
      {
        nombre: 'ADMINISTRADOR',
      }, {
        nombre: 'INVITADO',
      },
    ]
    for (const registro of registros) {
      await Rol.updateOrCreate({
        nombre: registro.nombre,
      }, {})
    }
  }
}
