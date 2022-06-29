'use strict'

const Perfil = use('App/Models/Perfil')

/*
|--------------------------------------------------------------------------
| PerfilSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class PerfilSeeder {
  async run () {
    await Perfil.createMany([
      {
        nomePerfil: 'admin'
      },
      {
        nomePerfil: 'estudante'
      },
      {
        nomePerfil: 'professor'
      },
      {
        nomePerfil: 'secretaria'
      }
    ])
  }
}

module.exports = PerfilSeeder
