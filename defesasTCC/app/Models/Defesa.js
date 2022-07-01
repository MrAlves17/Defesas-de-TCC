'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Defesa extends Model {
    static get table() {
        return 'Defesa'
    }
}

module.exports = Defesa