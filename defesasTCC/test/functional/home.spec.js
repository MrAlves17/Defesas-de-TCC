'use strict'

const { test, trait } = use('Test/Suite')('Home')
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker
const path = require('path')

trait('Test/Browser')
trait('DatabaseTransactions')

test('verifica se o administrador consegue ver lista de usuários pendentes após logar no sistema', async ({ browser }) => {

	const perfis = ["Administrador", "Estudante", "Professor", "Secretaria"]

	for (const perfil of perfis) {
		await Factory.model('App/Models/Perfil').create({nomePerfil: perfil})
	}

	// Given we have a user
	const admin = await Factory.model('App/Models/User').create({ 
		nomeUsuario: 'admin',
		email: 'admin@ufba.br',
		senha: '123456',
		matricula: 1,
		idPerfil: 1,
		ehInterno: 1,
		statusUsuario: 'Ativo'
	})

	const usuariosPendentes = []
	for(let i=0; i<3; i++){
		usuariosPendentes.push(await Factory.model('App/Models/User').create())
	}

	// And we are on the login page
	const page = await browser.visit('/')

  await page
    .hasElement('button[id="entrar"]')

	// When we fill and send the login form
	await page
	  .type('[name="email"]', admin.email)
	  .type('[name="senha"]', '123456')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	for(let i=0; i<3; i++){
		const up = usuariosPendentes[i]
		const c = await Database
								.select('nomePerfil')
								.from('Usuario')
								.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
								.where('Usuario.nomeUsuario', '=', up.nomeUsuario)
		let userDetails = "Nome do Usuário: "+up.nomeUsuario+'\n'
						+ "Email: "+up.email+'\n'
						+ "Matrícula: "+up.matricula+'\n'
						+ "Perfil: "+c[0].nomePerfil+'\n'
						+ "Interno? "+up.ehInterno+'\n'
						+ "Status: "+up.statusUsuario+'\n'
		await page.assertHas(userDetails)
	}

}).timeout(0)

test('verifica se o administrador consegue aprovar cadastros pendentes após logar no sistema', async ({ browser, assert }) => {
	
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Administrador'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Estudante'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Professor'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Secretaria'})

	// Given we have a user
	const admin = await Factory.model('App/Models/User').create({ 
		nomeUsuario: 'admin',
		email: 'admin@ufba.br',
		senha: '123456',
		matricula: 1,
		idPerfil: 1,
		ehInterno: 1,
		statusUsuario: 'Ativo'
	})

	const usuariosPendentes = []
	for(let i=0; i<3; i++){
		usuariosPendentes.push(await Factory.model('App/Models/User').create())
	}

	// And we are on the login page
	const page = await browser.visit('/')

	await page
		.hasElement('button[id="entrar"]')
	// When we fill and send the login form
	await page
	  .type('[name="email"]', admin.email)
	  .type('[name="senha"]', '123456')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

  	const uid = 1

	const up = usuariosPendentes[uid]
	const c1 = await Database
						.select('nomePerfil')
						.from('Usuario')
						.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
						.where('Usuario.id', '=', up.id)
  
	let userDetails = "Nome do Usuário: "+up.nomeUsuario+'\n'
					+ "Email: "+up.email+'\n'
					+ "Matrícula: "+up.matricula+'\n'
					+ "Perfil: "+c1[0].nomePerfil+'\n'
					+ "Interno? "+up.ehInterno+'\n'
					+ "Status: "+up.statusUsuario+'\n'

	await page.assertHas(userDetails)

	await page
		.hasElement('button[name="aceitar-'+usuariosPendentes[uid].id+'"]')

	await page
		.click('button[name="aceitar-'+usuariosPendentes[uid].id+'"]')
		.waitForNavigation()

	await page.assertPath('/home')

	await assert.notInclude(await page.getText(), userDetails)

	await page.assertHas("Cadastro de "+up.nomeUsuario+" aceito")

	for(let i=0; i<3; i++){
    if(uid == i) continue
		const up = usuariosPendentes[i]
		const c2 = await Database
								.select('nomePerfil')
								.from('Usuario')
								.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
								.where('Usuario.id', '=', up.id)
		
		let userDetails = "Nome do Usuário: "+up.nomeUsuario+'\n'
						+ "Email: "+up.email+'\n'
						+ "Matrícula: "+up.matricula+'\n'
						+ "Perfil: "+c2[0].nomePerfil+'\n'
						+ "Interno? "+up.ehInterno+'\n'
						+ "Status: "+up.statusUsuario+'\n'
		await page.assertHas(userDetails)
	}

}).timeout(0)

test('verifica se o administrador consegue recusar cadastros pendentes após logar no sistema', async ({ browser, assert }) => {
	
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Administrador'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Estudante'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Professor'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Secretaria'})

	// Given we have a user
	const admin = await Factory.model('App/Models/User').create({ 
		nomeUsuario: 'admin',
		email: 'admin@ufba.br',
		senha: '123456',
		matricula: 1,
		idPerfil: 1,
		ehInterno: 1,
		statusUsuario: 'Ativo'
	})

	const usuariosPendentes = []
	for(let i=0; i<3; i++){
		usuariosPendentes.push(await Factory.model('App/Models/User').create())
	}

	// And we are on the login page
	const page = await browser.visit('/')

  	await page
   		.hasElement('button[id="entrar"]')

	// When we fill and send the login form
	await page
	  .type('[name="email"]', admin.email)
	  .type('[name="senha"]', '123456')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	const uid = 1
	const up = usuariosPendentes[uid]
	const c1 = await Database
									.select('nomePerfil')
									.from('Usuario')
									.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
									.where('Usuario.id', '=', up.id)

	let userDetails = "Nome do Usuário: "+up.nomeUsuario+'\n'
				    + "Email: "+up.email+'\n'
				    + "Matrícula: "+up.matricula+'\n'
				    + "Perfil: "+c1[0].nomePerfil+'\n'
				    + "Interno? "+up.ehInterno+'\n'
				    + "Status: "+up.statusUsuario+'\n'

	await page.assertHas(userDetails)

	await page
		.hasElement('button[name="recusar-'+usuariosPendentes[uid].id+'"]')

	await page
		.click('button[name="recusar-'+usuariosPendentes[uid].id+'"]')
		.waitForNavigation()

	await page.assertPath('/home')

	await assert.notInclude(await page.getText(), userDetails)

	await page.assertHas("Cadastro de "+up.nomeUsuario+" recusado")

	for(let i=0; i<3; i++){
    if(uid == i) continue
		const up = usuariosPendentes[i]
		const c2 = await Database
								.select('nomePerfil')
								.from('Usuario')
								.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
								.where('Usuario.id', '=', up.id)
		
		let userDetails = "Nome do Usuário: "+up.nomeUsuario+'\n'
						+ "Email: "+up.email+'\n'
						+ "Matrícula: "+up.matricula+'\n'
						+ "Perfil: "+c2[0].nomePerfil+'\n'
						+ "Interno? "+up.ehInterno+'\n'
						+ "Status: "+up.statusUsuario+'\n'
		await page.assertHas(userDetails)
	}

}).timeout(0)

test('verifica se o estudante consegue cadastrar defesa após logar no sistema', async ({ browser }) => {
	
	// Dado que temos todos os perfis
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Administrador'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Estudante'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Professor'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Secretaria'})

	// Dado que temos um estudante
	const senha = faker.internet.password()
	const estudante = await Factory.model('App/Models/User').create({ 
		senha: senha,
		idPerfil: 2,
		ehInterno: 1,
		statusUsuario: 'Ativo'
	})

	const orientador = await Factory.model('App/Models/User').create({
		statusUsuario: 'Ativo',
		ehInterno: 1,
		idPerfil: 3
	})

	const page = await browser.visit('/')

	await page
		.hasElement('button[id="entrar"]')

	await page
	  .type('[name="email"]', estudante.email)
	  .type('[name="senha"]', senha)
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	await page.assertHas('Agendamento de Defesa')

	await page
		.hasElement('button[name="criaDefesa"]')

	await page
		.type('[name="dataDefesa"', faker.date.future())
		.type('[name="local"', 'PAF1 - 202')
		.type('[name="titulo"', 'Roteamento de Veículos')
		.type('[name="descricao"', 'Rotear veículos é legal')
		.type('[name="tags"', '#otimizacao, #roteamento')
		.type('[name="emailOrientador"]', orientador.email)
		.click('button[name="criaDefesa"')
		.waitForNavigation()

	await page.assertPath('/home')

	await page.assertHas('Defesa Criada com Sucesso.')

	const defesas = await Database
							.from('Defesa')
							.join('Banca','Defesa.idBanca','=','Banca.idBanca')
							.leftJoin('Usuario as PO','Banca.IdOrientador','=','PO.id')
							.leftJoin('Usuario as CA','Banca.IdConvidadoA','=','CA.id')
							.leftJoin('Usuario as CB','Banca.IdConvidadoB','=','CB.id')
							.select('Defesa.*')
							.select('PO.nomeUsuario as nomeOrientador')
							.select('CA.nomeUsuario as nomeConvidadoA')
							.select('CB.nomeUsuario as nomeConvidadoB')
							.select('Banca.*')
							.where('idEstudante','=',estudante.id)

	const defesa = defesas[0]
	await page
		.assertHas("Data: "+ defesa.dataDefesa +"\n"
				 + "Local: "+ defesa.local +"\n"
				 + "Título: "+ defesa.titulo +"\n"
				 + "Descrição: "+ defesa.descricao +"\n"
				 + "Tags: "+ defesa.tags +"\n"
				 + "Status: "+ defesa.statusDefesa +"\n"
				 + "Professor Orientador: "+ defesa.nomeOrientador +"\n"
				 + "Status do Orientador: Aprovação Pendente\n"
				 + "Professor Convidado A: "+ defesa.nomeConvidadoA +"\n"
				 + "Status do Convidado A: null\n"
				 + "Professor Convidado B: "+ defesa.nomeConvidadoB +"\n"
				 + "Status do Convidado B: null\n")
				 

}).timeout(0)

test('verifica se o estudante consegue editar defesa após criar defesa', async ({ browser }) => {
	
	// Dado que temos todos os perfis
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Administrador'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Estudante'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Professor'})
	await Factory.model('App/Models/Perfil').create({nomePerfil: 'Secretaria'})

	// Dado que temos um estudante
	const senha = faker.internet.password()
	const estudante = await Factory.model('App/Models/User').create({ 
		senha: senha,
		idPerfil: 2,
		ehInterno: 1,
		statusUsuario: 'Ativo'
	})

	const orientador = await Factory.model('App/Models/User').create({
		email: 'orientador@ufba.br',
		ehInterno: 1,
		idPerfil: 3,
		statusUsuario: 'Ativo'
	  })

	let defesa = await Factory.model('App/Models/Defesa').create({idEstudante: estudante.id})

	const page = await browser.visit('/')

	await page
		.hasElement('button[id="entrar"]')

	await page
	  .type('[name="email"]', estudante.email)
	  .type('[name="senha"]', senha)
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	await page
		.hasElement('button[id="edita-'+defesa.id+'"]')

	await page
		.click('button[id="edita-'+defesa.id+'"]')
		.waitForNavigation()

	await page.assertPath('/home/edita/'+defesa.id)

	await page
		.hasElement('button[name="salvaDefesa"]')

	await page
	  	.clear('[name="dataDefesa"')
		.clear('[name="local"')
		.clear('[name="titulo"')
		.clear('[name="descricao"')
		.clear('[name="tags"')
		.clear('[name="emailOrientador"]')
		.type('[name="dataDefesa"', faker.date.future())
		.type('[name="local"', 'PAF1 - 202')
		.type('[name="titulo"', 'Roteamento de Veículos')
		.type('[name="descricao"', 'Rotear veículos é legal')
		.type('[name="tags"', '#otimizacao, #roteamento')
		.type('[name="emailOrientador"]', orientador.email)
		.click('button[name="salvaDefesa"')
		.waitForNavigation()

	await page.assertPath('/home')

	// await page.assertHas('Defesa Atualizada com Sucesso.')

	const defesas = await Database
							.from('Defesa')
							.join('Banca','Defesa.idBanca','=','Banca.idBanca')
							.leftJoin('Usuario as PO','Banca.IdOrientador','=','PO.id')
							.leftJoin('Usuario as CA','Banca.IdConvidadoA','=','CA.id')
							.leftJoin('Usuario as CB','Banca.IdConvidadoB','=','CB.id')
							.select('Defesa.*')
							.select('PO.nomeUsuario as nomeOrientador')
							.select('CA.nomeUsuario as nomeConvidadoA')
							.select('CB.nomeUsuario as nomeConvidadoB')
							.select('Banca.*')
							.where('idEstudante','=',estudante.id)

	// console.log(await page.getText())
	// console.log(estudante.toJSON())
	defesa = defesas[0]
	// console.log(`Estudante: ${estudante.nomeUsuario}\n`
	// + "Data: "+ defesa.dataDefesa +"\n"
	// + "Local: "+ defesa.local +"\n"
	// + "Título: "+ defesa.titulo +"\n"
	// + "Descrição: "+ defesa.descricao +"\n"
	// + "Tags: "+ defesa.tags +"\n"
	// + "Status: "+ defesa.statusDefesa +"\n"
	// + "Professor Orientador: "+ defesa.nomeOrientador +"\n"
	// + "Status do Orientador: Aprovação Pendente\n"
	// + "Professor Convidado A: "+ defesa.nomeConvidadoA +"\n"
	// + "Status do Convidado A: null\n"
	// + "Professor Convidado B: "+ defesa.nomeConvidadoB +"\n"
	// + "Status do Convidado B: null\n")
	await page
		.assertHas(
				`Estudante: ${estudante.nomeUsuario}\n`
				+ "Data: "+ defesa.dataDefesa +"\n"
				+ "Local: "+ defesa.local +"\n"
				+ "Título: "+ defesa.titulo +"\n"
				+ "Descrição: "+ defesa.descricao +"\n"
				+ "Tags: "+ defesa.tags +"\n"
				+ "Status: "+ defesa.statusDefesa +"\n"
				+ "Professor Orientador: "+ defesa.nomeOrientador +"\n"
				+ "Status do Orientador: Aprovação Pendente\n"
				+ "Professor Convidado A: "+ defesa.nomeConvidadoA +"\n"
				+ "Status do Convidado A: null\n"
				+ "Professor Convidado B: "+ defesa.nomeConvidadoB +"\n"
				+ "Status do Convidado B: null\n"
		)

}).timeout(0)