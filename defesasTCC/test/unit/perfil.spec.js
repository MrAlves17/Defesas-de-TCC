'use strict'

const { test, trait } = use('Test/Suite')('Perfil')
const Factory = use('Factory')
const Perfil = use('App/Models/Perfil')

trait('DatabaseTransactions')

test('Deve criar os perfis no banco de dados', async ({ assert }) => {
  const perfis = ["Administrador", "Estudante", "Professor", "Secretaria"]

	for (const perfil of perfis) {
		await Factory.model('App/Models/Perfil').create({nomePerfil: perfil}
  )}

  const returnedPerfis = await Perfil.query().setHidden(['created_at', 'updated_at']).fetch()

  const comparePerfis = []

  perfis.forEach((perfil, index) => {
    comparePerfis.push({
      idPerfil: index + 1,
      nomePerfil: perfil
    })
  })

  await assert.deepEqual(comparePerfis, returnedPerfis.toJSON())
})
