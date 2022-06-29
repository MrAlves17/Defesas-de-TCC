'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Banca extends Model {
    static get table() {
        return 'Banca'
    }
}

module.exports = Banca