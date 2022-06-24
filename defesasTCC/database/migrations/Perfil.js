'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PerfilSchema extends Schema {
  up () {
    this.create('Perfil', (table) => {
      table.increments('idPerfil').unsigned().notNullable()
      table.enum('nomePerfil', 255).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('Perfil')
  }
}

module.exports = PerfilSchema
