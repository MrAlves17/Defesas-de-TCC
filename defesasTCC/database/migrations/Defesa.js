'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DefesaSchema extends Schema {
  up () {
    this.create('Defesa', (table) => {
        table.increments('idDefesa').unsigned().notNullable()
        table.date('dataDefesa').notNullable().unique()
        table.string('local', 255).notNullable()
        table.string('titulo', 255).notNullable().unique()
        table.string('descricao', 255).notNullable()
        table.string('tags', 255).notNullable()
        table.integer('idEstudante').unsigned().references('id').inTable('Usuario').notNullable()
        table.integer('idBanca').unsigned().references('idBanca').inTable('Banca')
        table.string('statusDefesa', 255).notNullable().defaultTo('Agendada')
        table.timestamps()
    })
  }

  down () {
    this.drop('Defesa')
  }
}

module.exports = DefesaSchema
