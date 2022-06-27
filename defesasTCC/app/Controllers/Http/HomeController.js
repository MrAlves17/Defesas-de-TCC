'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Hash = use('Hash')
const obj = {nome:'abcde'}

class HomeController {

    async view( {auth, view, response} ){
        const usuariosPendentes = await Database.from('Usuario').select('*').where('statusUsuario', 'like', '%Pendente%')
        await console.log(usuariosPendentes)
        return await view.render('home',{usuariosPendentes})
    }

}

module.exports = HomeController
