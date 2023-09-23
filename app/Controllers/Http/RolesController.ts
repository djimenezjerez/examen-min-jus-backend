import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rol from 'App/Models/Rol'

export default class UsuariosController {
  public async index({ response }: HttpContextContract) {
    const registros = await Rol.query()
    return response.send({
      message: 'Lista de registros',
      payload: registros,
    })
  }
}
