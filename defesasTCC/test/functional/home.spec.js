'use strict'

const { test, trait } = use('Test/Suite')('Home')
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
const fake_obj = use('@faker-js/faker')
const faker = fake_obj.faker

trait('Test/Browser')
trait('DatabaseTransactions')

test('verifica se o administrador consegue ver lista de usuários pendentes após logar no sistema', async ({ browser }) => {
	
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

	for(let i=0; i<3; i++){
		const up = usuariosPendentes[i]
		const c = await Database
								.select('nomePerfil')
								.from('Usuario')
								.join('Perfil', 'Perfil.idPerfil', '=', 'Usuario.idPerfil')
								.where('Usuario.nomeUsuario', '=', up.nomeUsuario)
		
		await page.assertHas(up.nomeUsuario+'\t'+up.email+'\t'+up.matricula+'\t'+c[0].nomePerfil)
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
  
  let userDetails = up.nomeUsuario+'\t'+up.email+'\t'+up.matricula+'\t'+c1[0].nomePerfil
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
		
		await page.assertHas(up.nomeUsuario+'\t'+up.email+'\t'+up.matricula+'\t'+c2[0].nomePerfil)
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

  let userDetails = up.nomeUsuario+'\t'+up.email+'\t'+up.matricula+'\t'+c1[0].nomePerfil
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
		
		await page.assertHas(up.nomeUsuario+'\t'+up.email+'\t'+up.matricula+'\t'+c2[0].nomePerfil)
	}

}).timeout(0)

