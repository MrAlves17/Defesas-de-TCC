'use strict'

const { test, trait } = use('Test/Suite')('Authentication')
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker

trait('Test/Browser')
trait('DatabaseTransactions')

test('verifica se usuário ativo loga após apresentar credenciais, se aparece seu nome na home e desloga', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({senha: senha, statusUsuario: 'Ativo'})
	
	// And we are on the login page
	const page = await browser.visit('/')

	await page
      .hasElement('button[id="entrar"]')
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha)
	  .click('button[id="entrar"]')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	await page.assertHas(user.nomeUsuario)

	await page
    	.hasElement('button[id="sair"]')
	await page
		.click('button[id="sair"]')
		.waitForNavigation()

	await page.assertPath('/')

}).timeout(0)

test('um usuário que logar com credenciais erradas deve receber um badRequest(400) na rota \'/\'', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({
		senha: senha,
		statusUsuario: 'Pendente'
	})
	// And we are on the login page
	let page = await browser.visit('/')
	
	await page
   		.hasElement('button[id="entrar"]')
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha+'errada')
	  .click('button[id="entrar"]')
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
		senha: senha,
		statusUsuario: 'Pendente'
	})
	// And we are on the login page
	let page = await browser.visit('/')
	
	await page
   		.hasElement('button[id="entrar"]')
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha)
	  .click('button[id="entrar"]')
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
   		.hasElement('button[id="cadastrar"]')

	await page
		.click('button[id="cadastrar"]')
		.waitForNavigation()

	await page.assertPath('/register')

	const senha = faker.internet.password()
	const perfis = ['2','3','4']
	const interno = ['0','1']
	const uObj = { 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: faker.datatype.number({ min: 2, max: 4}),
		ehInterno: faker.datatype.number({ min: 0, max: 1}),
		statusUsuario: 'Pendente'
	}

	await page
   		.hasElement('button[id="cadastrar"]')

	await page
		.type('[name="nomeUsuario"]', uObj.nomeUsuario)
		.type('[name="email"]', uObj.email)
		.type('[name="senha"]', uObj.senha)
		.type('[name="matricula"]', uObj.matricula)
		.select('[name="idPerfil"]', perfis[uObj.idPerfil-2])
		.select('[name="ehInterno"]', interno[uObj.ehInterno])
		.click('button[id="cadastrar"]')
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