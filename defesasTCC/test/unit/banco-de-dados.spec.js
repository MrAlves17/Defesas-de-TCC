'use strict'

const { test } = use('Test/Suite')('Banco De Dados')
const Factory = use('Factory')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker
const Database = use('Database')
const Hash = use('Hash')

test('criação e consulta no BD da tabela Perfil e Usuario', async ({ assert }) => {
	const pObj = {
		nomePerfil: faker.word.noun()
	}
	const perfil = await Factory.model('App/Models/Perfil').create(pObj)
	const c1 = await Database.select('nomePerfil').from('Perfil').where('nomePerfil','=', pObj.nomePerfil)
	await assert.deepEqual([pObj], c1)
	const uObj = { 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: faker.internet.password(),
		matricula: faker.random.numeric(8),
		idPerfil: 1,
		ehInterno: 0,
		statusUsuario: 'Pendente'
	}
	const user = await Factory.model('App/Models/User').create(uObj)
	
	const c2 = await Database.select('nomeUsuario', 'email', 'senha', 'matricula', 'idPerfil', 'ehInterno', 'statusUsuario').from('Usuario').where('nomeUsuario','=', uObj.nomeUsuario)
	await assert.isTrue(await Hash.verify(uObj.senha, await c2[0].senha))
	delete uObj.senha
	delete c2[0].senha
	await assert.deepEqual([uObj], c2)

}).timeout(0)
