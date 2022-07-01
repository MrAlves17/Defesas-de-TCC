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
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker

Factory.blueprint('App/Models/User', (aaaa, index, data) => {
  return { 
		nomeUsuario: 'nomeUsuario' in data ? data.nomeUsuario:faker.name.firstName(),
		email: 'email' in data ? data.email : faker.internet.email(),
		senha: 'senha' in data ? data.senha : faker.internet.password(),
		matricula: 'matricula' in data ? data.matricula : faker.random.numeric(8),
		idPerfil: 'idPerfil' in data ? data.idPerfil : faker.datatype.number({ min: 1, max: 4}),
		ehInterno: 'ehInterno' in data ? data.ehInterno : faker.datatype.number({ min: 0, max: 1}),
		statusUsuario: 'statusUsuario' in data ? data.statusUsuario : 'Pendente'
	}
})

Factory.blueprint('App/Models/Perfil', (aaaa, index, data) => {
  return {
    nomePerfil: data.nomePerfil
  }
})
