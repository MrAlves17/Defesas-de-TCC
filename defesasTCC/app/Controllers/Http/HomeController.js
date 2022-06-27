'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Hash = use('Hash')
const obj = {nome:'abcde'}

class HomeController {

    async view( {auth, view, response} ){
        const usuariosPendentes = await Database.from('Usuario').join('Perfil','Usuario.idPerfil','=','Perfil.idPerfil').select('Usuario.*').select('Perfil.nomePerfil').where('statusUsuario', 'like', '%Pendente%')
        const obj = {up: usuariosPendentes}
        await console.log(usuariosPendentes)
        return await view.render('home',{obj})
    }

}

module.exports = HomeController
