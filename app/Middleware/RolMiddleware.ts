import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario';

export default class RolMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, props) {
    const usuario = await Usuario.query().preload('rol').where('id', auth.user ? auth.user.id : 0).first()
    if (usuario) {
      if (props.includes(usuario.rol.nombre)) {
        await next()
      } else {
        return response.status(401).json({
          message: 'Acceso no autorizado',
        })
      }
    } else {
      return response.status(401).json({
        message: 'Acceso no autorizado',
      })
    }
  }
}
