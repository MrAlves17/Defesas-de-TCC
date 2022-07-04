'use strict'

const { test, trait } = use('Test/Suite')('Banco De Dados')
const Factory = use('Factory')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker
const Database = use('Database')
const Hash = use('Hash')
const _ = use('lodash')

trait('DatabaseTransactions')

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

test('criação e consulta no BD da tabela Defesa e Banca', async ({ assert }) => {
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Administrador'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Estudante'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Professor'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Secretaria'})
	const estudante = await Factory.model('App/Models/User').create({
		idPerfil: 2
	})

	const orientador = await Factory.model('App/Models/User').create({
		idPerfil: 3
	})

	const convidadoA = await Factory.model('App/Models/User').create({
		idPerfil: 3
	})

	const convidadoB = await Factory.model('App/Models/User').create({
		idPerfil: 3
	})

	const banca = {
		idOrientador: orientador.id,
		statusOrientador: 'Pendente',
		idConvidadoA: convidadoA.id,
		statusConvidadoA: 'Pendente',
		idConvidadoB: convidadoB.id,
		statusConvidadoB: 'Pendente'
	}
	await Factory.model('App/Models/Banca').create(banca)

	const c1 = await Database.select('idBanca', 'idOrientador', 'statusOrientador', 'idConvidadoA', 'statusConvidadoA', 'idConvidadoB', 'statusConvidadoB').from('Banca')
	let bancaSalva = false
	for(let i=0; i<c1.length; i++){
		banca['idBanca'] = c1[i].idBanca
		if(_.isEqual(banca, c1[i])){
			bancaSalva = true
			break
		}
	}
	assert.isTrue(bancaSalva)

	const defesa = { 
		dataDefesa: '2022-07-04',
		local: faker.lorem.sentence(3),
		titulo: faker.lorem.sentence(5),
		descricao: faker.lorem.sentence(10),
		tags: faker.lorem.sentence(),
		idEstudante: estudante.id,
		idBanca: banca.idBanca,
		statusDefesa: 'Agendada'
	}
	await Factory.model('App/Models/Defesa').create(defesa)
	const c2 = await Database
						.select('idDefesa','dataDefesa', 'local', 'titulo', 'descricao', 'tags', 'idEstudante', 'idBanca', 'statusDefesa').from('Defesa')

	let defesaSalva = false
	for(let i=0; i<c2.length; i++){
		defesa['idDefesa'] = c2[i].idDefesa
		if(_.isEqual(defesa, c2[i])){
			defesaSalva = true
			break
		}
	}
	assert.isTrue(defesaSalva)

}).timeout(0)
