import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Usuario from 'App/Models/Usuario'

export default class UsuariosController {
  public async index({ request, response }: HttpContextContract) {
    const pagina = request.input('pagina') || 1
    const porPagina = request.input('porPagina') || 10
    const buscar = request.input('buscar') || ''

    const registros = await Database.from('usuarios').select('usuarios.id', 'usuarios.usuario', 'usuarios.nombre', 'usuarios.apellido_paterno as apellidoPaterno', 'usuarios.apellido_materno as apellidoMaterno', 'usuarios.apellido_materno', 'usuarios.rol_id as rolId', 'roles.nombre as rol').leftJoin('roles', 'roles.id', '=', 'usuarios.rol_id').where(q => {
      q.orWhere('usuarios.usuario', 'ilike', `%${buscar}%`).orWhere('usuarios.nombre', 'ilike', `%${buscar}%`).orWhere('usuarios.apellido_paterno', 'ilike', `%${buscar}%`).orWhere('usuarios.apellido_materno', 'ilike', `%${buscar}%`)
    }).orderBy('usuarios.usuario', 'asc').orderBy('usuarios.nombre', 'asc').orderBy('usuarios.apellido_paterno', 'asc').orderBy('usuarios.apellido_materno', 'asc').paginate(pagina, porPagina)
    registros.namingStrategy = {
      paginationMetaKeys() {
        return {
          total: 'total',
          perPage: 'perPage',
          currentPage: 'currentPage',
          lastPage: 'lastPage',
          firstPage: 'firstPage',
          firstPageUrl: 'firstPageUrl',
          lastPageUrl: 'lastPageUrl',
          nextPageUrl: 'nextPageUrl',
          previousPageUrl: 'previousPageUrl',
        }
      }
    }
    return response.send({
      message: 'Lista de registros',
      payload: registros.toJSON(),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        usuario: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
          rules.unique({
            table: 'usuarios',
            column: 'usuario',
            caseInsensitive: true,
          }),
        ]),
        password: schema.string([
          rules.maxLength(255),
          rules.trim(),
        ]),
        rolId: schema.number([
          rules.exists({ table: 'roles', column: 'id' }),
        ]),
        nombre: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
        apellidoPaterno: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
        apellidoMaterno: schema.string.nullable([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
      }),
    })
    try {
      const usuario = await Usuario.create(payload)
      return response.send({
        message: 'Registro almacenado',
        payload: {
          usuario: usuario.serialize(),
        },
      })
    } catch (err) {
      Logger.error(err)
      return response.status(500).send({
        message: 'Error al almacenar el registro',
      })
    }
  }

  public async show({ request, response }: HttpContextContract) {
    let usuario = await Database.from('usuarios').select('usuarios.id', 'usuarios.usuario', 'usuarios.nombre', 'usuarios.apellido_paterno as apellidoPaterno', 'usuarios.apellido_materno as apellidoMaterno', 'usuarios.apellido_materno', 'usuarios.rol_id as rolId', 'roles.nombre as rol').leftJoin('roles', 'roles.id', '=', 'usuarios.rol_id').where('usuarios.id', request.param('id')).firstOrFail()
    return response.send({
      message: 'Detalle del registro',
      payload: usuario,
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const usuario = await Usuario.findOrFail(request.param('id'))
    const payload = await request.validate({
      schema: schema.create({
        usuario: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
          rules.unique({
            table: 'usuarios',
            column: 'usuario',
            caseInsensitive: true,
            whereNot: { id: usuario.id },
          }),
        ]),
        password: schema.string.optional([
          rules.minLength(0),
          rules.maxLength(255),
          rules.trim(),
        ]),
        rolId: schema.number([
          rules.exists({ table: 'roles', column: 'id' }),
        ]),
        nombre: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
        apellidoPaterno: schema.string([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
        apellidoMaterno: schema.string.nullable([
          rules.maxLength(255),
          rules.escape(),
          rules.trim(),
        ]),
      }),
    })
    try {
      usuario.usuario = payload.usuario
      if (payload.password != '' && payload.password != null) {
        usuario.password = payload.password
      }
      usuario.rolId = payload.rolId
      usuario.nombre = payload.nombre
      usuario.apellidoPaterno = payload.apellidoPaterno
      usuario.apellidoMaterno = payload.apellidoMaterno
      await usuario.save()
      return response.send({
        message: 'Registro modificado',
        payload: {
          usuario: usuario.serialize(),
        },
      })
    } catch (err) {
      Logger.error(err)
      return response.status(500).send({
        message: 'Error al almacenar el registro',
      })
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const usuario = await Usuario.findOrFail(request.param('id'))
    try {
      await usuario.delete()
      return response.send({
        message: 'Registro eliminado',
      })
    } catch (err) {
      Logger.error(err)
      return response.status(500).send({
        message: 'Error al eliminar el registro',
      })
    }
  }
}
