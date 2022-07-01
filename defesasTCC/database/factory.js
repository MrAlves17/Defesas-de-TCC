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
		nomePerfil: 'nomePerfil' in data ? data.nomePerfil: faker.word.noun()
	}
})

Factory.blueprint('App/Models/Defesa', (aaaa, index, data) => {
	return { 
		  dataDefesa: 'dataDefesa' in data ? data.dataDefesa:faker.date.future(),
		  local: 'local' in data ? data.local : faker.lorem.sentence(3),
		  titulo: 'titulo' in data ? data.titulo : faker.lorem.sentence(5),
		  descricao: 'descricao' in data ? data.descricao : faker.lorem.sentence(10),
		  tags: 'tags' in data ? data.tags : faker.lorem.sentence(),
		  idEstudante: 'idEstudante' in data ? data.idEstudante : faker.datatype.number({ min: 0, max: 10}),
		  idBanca: 'idBanca' in data ? data.idBanca : faker.datatype.number({ min: 0, max: 10}),
		  statusDefesa: 'statusDefesa' in data ? data.statusDefesa : 'Agendada'
	}
})

Factory.blueprint('App/Models/Banca', (aaaa, index, data) => {
	return {
		idOrientador: 'idOrientador' in data ? data.idOrientador : faker.datatype.number({ min: 0, max: 10}),
		statusOrientador: 'statusOrientador' in data ? data.statusOrientador : null,
		idConvidadoA: 'idConvidadoA' in data ? data.idConvidadoA : faker.datatype.number({ min: 0, max: 10}),
		statusConvidadoA: 'statusConvidadoA' in data ? data.statusConvidadoA : null,
		idConvidadoB: 'idConvidadoB' in data ? data.idConvidadoB : faker.datatype.number({ min: 0, max: 10}),
		statusConvidadoB: 'statusConvidadoB' in data ? data.statusConvidadoB : null
	}
})