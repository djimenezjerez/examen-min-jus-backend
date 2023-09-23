import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pelicula_usuarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('usuario_id').unsigned().notNullable()
      table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('pelicula_id').unsigned().notNullable()
      table.foreign('pelicula_id').references('peliculas.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamp("deleted_at", { useTz: true }).defaultTo(null);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
