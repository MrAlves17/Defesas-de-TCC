'use strict'

const AdminUser = use('App/Models/User')

/*
|--------------------------------------------------------------------------
| AdminUserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class AdminUserSeeder {
  async run () {
    await AdminUser.create({
      nomeUsuario: 'Admin',
      email: 'admin@ufba.br',
      senha: '123456',
      matricula: '00000000',
      idPerfil: 1,
      ehInterno: true
    })
  }
}

module.exports = AdminUserSeeder
