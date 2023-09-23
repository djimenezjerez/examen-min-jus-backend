import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public usuario: string

  @column({ serializeAs: null })
  public password: string

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
}
