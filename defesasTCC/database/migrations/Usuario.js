'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuarioSchema extends Schema {
  up () {
    this.create('Usuario', (table) => {
      table.increments('idUsuario').unsigned().notNullable()
      table.string('nomeUsuario', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('senha', 255).notNullable()
      table.string('matricula').unique()
      table.integer('idPerfil').unsigned().references('idPerfil').inTable('Perfil').notNullable()
      table.bool('ehInterno').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('Usuario')
  }
}

module.exports = UsuarioSchema
