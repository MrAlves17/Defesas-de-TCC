'use strict'

const { test, trait, before } = use('Test/Suite')('Orientador Defesa')
const Factory = use('Factory')
const User = use('App/Models/User')
const Perfil = use('App/Models/Perfil')
const { faker } = use('@faker-js/faker')

trait('Test/Browser')
trait('DatabaseTransactions')

test('verifica se o aluno consegue escolher professor orientador na criação da defesa', async ({ browser }) => {
  const estudante = (await Factory.model('App/Models/User').create({
    senha: '123',
    idPerfil: 2,
    ehInterno: 1,
    statusUsuario: 'Ativo'
  })).toJSON()

  const orientador = (await Factory.model('App/Models/User').create({
    email: 'orientador@ufba.br',
    ehInterno: 1,
    idPerfil: 3,
    statusUsuario: 'Ativo'
  })).toJSON()

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
