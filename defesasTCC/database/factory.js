'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
Factory.blueprint('App/Models/User', (aaaa, index, data) => {
  return {
    nomeUsuario: data.nomeUsuario,
    email: data.email,
    senha: data.senha,
    matricula: data.matricula,
    idPerfil: data.idPerfil,
    ehInterno: data.ehInterno
  }
})

Factory.blueprint('App/Models/Perfil', (aaaa, index, data) => {
  return {
    nomePerfil: data.nomePerfil
  }
})
