import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import Usuario from 'App/Models/Usuario'
import Database from '@ioc:Adonis/Lucid/Database'
import Pelicula from 'App/Models/Pelicula'

export default class PeliculasController {
  public async index({ auth, request, response }: HttpContextContract) {
    const usuario = await Usuario.query().where('id', auth.user?.id || 0).firstOrFail()
    const pagina = request.input('pagina') || 1
    const porPagina = request.input('porPagina') || 10
    const buscar = request.input('buscar') || ''

    const registros = await Database.from('pelicula_usuarios').select('pelicula_usuarios.usuario_id as usuarioId', 'peliculas.id', 'peliculas.id_imdb as imdbID', 'peliculas.titulo as Title', 'peliculas.poster as Poster').leftJoin('peliculas', 'pelicula_usuarios.pelicula_id', '=', 'peliculas.id').where('pelicula_usuarios.usuario_id', usuario.id).where('peliculas.titulo', 'ilike', `%${buscar}%`).orderBy('peliculas.titulo', 'asc').paginate(pagina, porPagina)
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

  public async store({ auth, request, response }: HttpContextContract) {
    const usuario = await Usuario.query().where('id', auth.user?.id || 0).firstOrFail()
    const payload = await request.validate({
      schema: schema.create({
        idImdb: schema.string([
          rules.maxLength(255),
          rules.trim(),
        ]),
        titulo: schema.string([
          rules.maxLength(255),
          rules.trim(),
        ]),
        poster: schema.string([
          rules.maxLength(255),
          rules.trim(),
        ]),
      }),
    })
    const trx = await Database.transaction()
    try {
      let pelicula = await Pelicula.findBy('id_imdb', payload.idImdb)
      if (pelicula) {
        await Database.from('pelicula_usuarios').where('usuario_id', usuario.id).where('pelicula_id', pelicula.id).update({
          'deleted_at': null,
        })
      } else{
        pelicula = new Pelicula().useTransaction(trx)
        pelicula.id_imdb = payload.idImdb
        pelicula.titulo = payload.titulo
        pelicula.poster = payload.poster
        await pelicula.save()
        await Database.table('pelicula_usuarios').returning(['pelicula_id', 'usuario_id']).insert({
          'usuario_id': usuario.id,
          'pelicula_id': pelicula.id,
          'deleted_at': null,
        }).useTransaction(trx)
      }
      await trx.commit()
      return response.send({
        message: 'Registro almacenado',
        payload: {
          pelicula: pelicula.serialize(),
        },
      })
    } catch (err) {
      await trx.rollback()
      Logger.error(err)
      return response.status(500).send({
        message: 'Error al almacenar el registro',
      })
    }
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    const usuario = await Usuario.query().where('id', auth.user?.id || 0).firstOrFail()
    const pelicula = await Pelicula.findOrFail(request.param('id'))
    try {
      await Database.from('pelicula_usuarios').where('usuario_id', usuario.id).where('pelicula_id', pelicula.id).update({
        'deleted_at': new Date(),
      })
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
