'use strict'

const { test, trait } = use('Test/Suite')('Authentication')
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker

trait('Test/Browser')
trait('DatabaseTransactions')


function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

test('verifica se usuário ativo loga após apresentar credenciais, se aparece seu nome na home e desloga ao acessar \'/logout\'', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({ 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(1,4),
		ehInterno: getRndInteger(0,1),
		statusUsuario: 'Ativo'
	})
	
	// And we are on the login page
	const page = await browser.visit('/')

	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha)
	  .submitForm('form[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	await page.assertHas(user.nomeUsuario)

	const page2 = await browser.visit('/logout')

	await page2.assertPath('/')

}).timeout(0)

test('um usuário que logar com credenciais erradas deve receber um badRequest(400) na rota \'/\'', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({ 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(1,4),
		ehInterno: getRndInteger(0,1),
		statusUsuario: 'Pendente'
	})
	// And we are on the login page
	let page = await browser.visit('/')
  
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha+'errada')
	  .submitForm('form[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be again on the login page
	await page.assertPath('/')
	
	// And we expect to see an badRequest Status
	await page.assertStatus(400)
	await page.assertHas('Credenciais não conferem')
}).timeout(0)

test('um usuário pendente deve receber um badRequest(400) na rota \'/\'', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({ 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(1,4),
		ehInterno: getRndInteger(0,1),
		statusUsuario: 'Pendente'
	})
	// And we are on the login page
	let page = await browser.visit('/')
  
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha)
	  .submitForm('form[id="entrar"]')
	  .waitForNavigation()
	
	// We expect to be again on the login page
	await page.assertPath('/')
	
	// And we expect to see an badRequest Status
	await page.assertStatus(400)
	await page.assertHas('Usuario não está Ativo. Contate o Administrador')
}).timeout(0)

test('cadastro de usuário', async ({ browser, assert }) => {
	let page = await browser.visit('/')
  
	
	await page
		.submitForm('form[id="cadastrar"]')
		.waitForNavigation()

	await page.assertPath('/register')

	const senha = faker.internet.password()
	const uObj = { 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(2,4),
		ehInterno: getRndInteger(0,1),
		statusUsuario: 'Pendente'
	}

	await page
		.type('[name="nomeUsuario"]', uObj.nomeUsuario)
		.type('[name="email"]', uObj.email)
		.type('[name="senha"]', uObj.senha)
		.type('[name="matricula"]', uObj.matricula)
		.select('[name="idPerfil"]', uObj.idPerfil)
		.select('[name="ehInterno"]', uObj.ehInterno)
		.submitForm('form[id="cadastrar"]')
		.waitForNavigation()
	
	// We expect to be again on the login page
	await page.assertPath('/')
	
	// And we expect to see an badRequest Status
	await page.assertHas('Usuário Criado com Sucesso. Aguardando ativação por parte do Administrador')

	const consulta = await Database.select('nomeUsuario', 'email', 'senha', 'matricula', 'idPerfil', 'ehInterno', 'statusUsuario').from('Usuario').where('nomeUsuario','=', uObj.nomeUsuario)
	await assert.isTrue(await Hash.verify(uObj.senha, await consulta[0].senha))
	delete uObj.senha
	delete consulta[0].senha
	await assert.deepEqual([uObj], consulta)
}).timeout(0)