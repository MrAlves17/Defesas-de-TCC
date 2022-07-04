'use strict'

const { test, trait, before } = use('Test/Suite')('Orientador Defesa')
const Factory = use('Factory')
const User = use('App/Models/User')
const Perfil = use('App/Models/Perfil')
const { faker } = use('@faker-js/faker')

trait('Test/Browser')
trait('DatabaseTransactions')

before(async () => {
  await Factory.model('App/Models/User').create({
    id: 1,
    senha: '123',
    idPerfil: 2,
    ehInterno: true,
    statusUsuario: 'Ativo'
  })

  await Factory.model('App/Models/User').create({
    id: 2,
    senha: '123',
    email: 'orientador@ufba.br',
    ehInterno: 1,
    idPerfil: 3,
    statusUsuario: 'Ativo'
  })
})

test('verifica se o aluno consegue escolher professor orientador na criação da defesa', async ({ browser }) => {
  const estudante = await User.find(1)

  const orientador = await User.find(2)

  const page = await browser.visit('/')

	await page
		.hasElement('button[id="entrar"]')

	await page
	  .type('[name="email"]', estudante.email)
	  .type('[name="senha"]', '123')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
    .assertPath('/home')

    await page.assertHas('Agendamento de Defesa')

    await page
      .hasElement('button[name="criaDefesa"]')

    await page
      .type('[name="dataDefesa"]', faker.date.future())
      .type('[name="local"]', 'PAF1 - 202')
      .type('[name="titulo"]', 'Roteamento de Veículos')
      .type('[name="descricao"]', 'Rotear veículos é legal')
      .type('[name="tags"]', '#otimizacao, #roteamento')
      .type('[name="emailOrientador"]', orientador.email)
      .click('button[name="criaDefesa"]')
      .waitForNavigation()

  await page.assertHas(
    `Professor Orientador: ${orientador.nomeUsuario}\n` +
    `Status do Orientador: Aprovação Pendente\n`
  )
}).timeout(0)

test('verifica se o professor orientador consegue confirmar a participação em uma defesa', async ({ browser }) => {
  const orientador = await User.find(2)

  const banca = await Factory.model('App/Models/Banca').create({
    idBanca: 1,
    idOrientador: 2,
    statusOrientador: 'Aprovação Pendente'
  })

  const defesa = await Factory.model('App/Models/Defesa').create({
    idDefesa: 1,
    idEstudante: 1,
    idBanca: 1
  })

  const page = await browser.visit('/')

  await page
		.hasElement('button[id="entrar"]')

	await page
	  .type('[name="email"]', orientador.email)
	  .type('[name="senha"]', '123')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
    .assertPath('/home')

  await page.assertHas('Suas Defesas Pendentes')

  await page
      .hasElement('button[name="confirmaDefesa"]')

  await page
    .assertHas(
      `Professor Orientador: ${orientador.nomeUsuario}\n` +
      `Status do Orientador: Aprovação Pendente\n`
    )
    .click('button[id="confirmaDefesa"]')
    .waitForNavigation()
    .assertPath('/home')
    .assertHas(
      `Professor Orientador: ${orientador.nomeUsuario}\n` +
      `Status do Orientador: Confirmado\n`
    )
}).timeout(0)

test('verifica se o professor orientador consegue recusar a participação em uma defesa', async ({ browser }) => {
  const orientador = await User.find(2)

  await Factory.model('App/Models/Banca').create({
    idBanca: 1,
    idOrientador: 2,
    statusOrientador: 'Aprovação Pendente'
  })

  await Factory.model('App/Models/Defesa').create({
    idDefesa: 1,
    idEstudante: 1,
    idBanca: 1
  })

  const page = await browser.visit('/')

  await page
		.hasElement('button[id="entrar"]')

	await page
	  .type('[name="email"]', orientador.email)
	  .type('[name="senha"]', '123')
	  .click('button[id="entrar"]')
	  .waitForNavigation()
    .assertPath('/home')

    await page.assertHas('Suas Defesas Pendentes')

    await page
      .hasElement('button[name="recusaDefesa"]')

  await page
    .assertHas(
      `Professor Orientador: ${orientador.nomeUsuario}\n` +
      `Status do Orientador: Aprovação Pendente\n`
    )
    .click('button[id="recusaDefesa"]')
    .waitForNavigation()
    .assertPath('/home')
}).timeout(0)