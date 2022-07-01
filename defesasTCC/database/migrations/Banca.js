'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BancaSchema extends Schema {
  up () {
    this.create('Banca', (table) => {
        table.increments('idBanca').unsigned().notNullable()
        table.integer('idOrientador').unsigned().references('id').inTable('Usuario')
        table.string('statusOrientador', 255)
        table.integer('idConvidadoA').unsigned().references('id').inTable('Usuario')
        table.string('statusConvidadoA', 255)
        table.integer('idConvidadoB').unsigned().references('id').inTable('Usuario')
        table.string('statusConvidadoB', 255)
        table.timestamps()
    })
  }

  down () {
    this.drop('Banca')
  }
}

module.exports = BancaSchema
