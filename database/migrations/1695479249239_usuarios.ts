import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('usuario', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.integer('rol_id').unsigned().notNullable()
      table.foreign('rol_id').references('roles.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('nombre', 255).notNullable()
      table.string('apellido_paterno', 255).notNullable()
      table.string('apellido_materno', 255).nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
