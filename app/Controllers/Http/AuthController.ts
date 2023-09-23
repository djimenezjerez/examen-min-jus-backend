import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Usuario from 'App/Models/Usuario'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        usuario: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
        password: schema.string([
          rules.maxLength(180),
          rules.trim(),
        ]),
      }),
    })

    const usuario = await Usuario.query().where('usuario', payload.usuario.toLowerCase()).first()
    if (usuario) {
      try {
        const token = await auth.use('api').attempt(payload.usuario.toLowerCase(), payload.password, {
          expiresIn: '365 days'
        })
        return response.send({
          message: 'Bienvenido',
          payload: {
            ...{
              type: token.type,
              token: token.token,
              expiresAt: token.expiresAt,
            },
            usuario: usuario.serialize(),
          }
        })
      } catch {
        return response.status(422).send({
          message: 'Acceso denegado',
          errors: {
            password: ['Credenciales incorrectas'],
          },
        })
      }
    } else {
      return response.status(422).send({
        message: 'Acceso denegado',
        errors: {
          nombre: ['Usuario inexistente'],
        },
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      auth.logout()
      return response.send({
        message: 'Sesión finalizada',
      })
    } catch {
      return response.status(422).send({
        message: 'Debe iniciar sesión',
      })
    }
  }
}
