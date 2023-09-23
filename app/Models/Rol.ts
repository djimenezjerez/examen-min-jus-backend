import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Usuario from './Usuario'

export default class Rol extends BaseModel {
  public static table = 'roles'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async guardarRegistro(registro: Rol) {
    if (registro.$dirty.nombre) {
      registro.nombre = registro.nombre.toUpperCase()
    }
  }

  @hasMany(() => Usuario, {
    localKey: 'id',
    foreignKey: 'rolId',
  })
  public usuarios: HasMany<typeof Usuario>
}
