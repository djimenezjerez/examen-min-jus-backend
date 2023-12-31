import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Rol from './Rol'
import Pelicula from './Pelicula'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public usuario: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: 'rolId' })
  public rolId: number

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column()
  public nombre: string

  @column({ serializeAs: 'apellidoPaterno' })
  public apellidoPaterno: string

  @column({ serializeAs: 'apellidoMaterno' })
  public apellidoMaterno: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (registro: Usuario) {
    if (registro.$dirty.password) {
      registro.password = await Hash.make(registro.password)
    }
    if (registro.$dirty.usuario) {
      registro.usuario = registro.usuario.toLowerCase()
    }
  }

  @belongsTo(() => Rol, {
    localKey: 'id',
    foreignKey: 'rolId',
  })
  public rol: BelongsTo<typeof Rol>

  @manyToMany(() => Pelicula, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'usuario_id',
    pivotRelatedForeignKey: 'pelicula_id',
    pivotTable: 'pelicula_usuarios',
    pivotColumns: ['usuario_id', 'pelicula_id', 'deleted_at'],
  })
  public peliculas: ManyToMany<typeof Pelicula>
}
