'use strict'

const { test, trait } = use('Test/Suite')('Authentication')
const Factory = use('Factory')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker

trait('Test/Browser')
trait('DatabaseTransactions')

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

test('verifica se usuário loga após apresentar credenciais, se aparece seu nome na home e desloga ao acessar \'/logout\'', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({ 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(1,4),
		ehInterno: getRndInteger(0,1) 
	})
	
	// And we are on the login page
	const page = await browser.visit('/')

	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha)
	  .submitForm('form')
	  .waitForNavigation()
  
	// We expect to be on the homepage
	await page.assertPath('/home')

	await page.assertHas(user.nomeUsuario)

	const page2 = await browser.visit('/logout')

	await page2.assertPath('/')

}).timeout(0)

test('deve aparecer um badRequest(400) na rota \'/\' ao utilizar credenciais inválidas', async ({ browser }) => {
	// Given we have a user
	const senha = faker.internet.password()
	const user = await Factory.model('App/Models/User').create({ 
		nomeUsuario: faker.name.firstName(),
		email: faker.internet.email(),
		senha: senha,
		matricula: faker.random.numeric(8),
		idPerfil: getRndInteger(1,4),
		ehInterno: getRndInteger(0,1) 
	})
	// And we are on the login page
	let page = await browser.visit('/')
  
	// When we fill and send the login form
	await page
	  .type('[name="email"]', user.email)
	  .type('[name="senha"]', senha+'errada')
	  .submitForm('form')
	  .waitForNavigation()
  
	// We expect to be again on the login page
	await page.assertPath('/')
	
	// And we expect to see an badRequest Status
	await page.assertStatus(400)
}).timeout(0)