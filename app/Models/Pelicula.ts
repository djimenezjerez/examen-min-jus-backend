import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Usuario from './Usuario'

export default class Pelicula extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_imdb: string

  @column({ serializeAs: 'titulo' })
  public titulo: string

  @column({ serializeAs: 'poster' })
  public poster: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @manyToMany(() => Usuario, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'pelicula_id',
    pivotRelatedForeignKey: 'usuario_id',
    pivotTable: 'pelicula_usuarios',
    pivotColumns: ['usuario_id', 'pelicula_id', 'deleted_at'],
  })
  public usuarios: ManyToMany<typeof Usuario>
}
