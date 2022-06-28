'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Hash = use('Hash')
const obj = {nome:'abcde'}

class HomeController {

    async view( {auth, view, response} ){
        const usuariosPendentes = await Database.from('Usuario').join('Perfil','Usuario.idPerfil','=','Perfil.idPerfil').select('Usuario.*').select('Perfil.nomePerfil').where('statusUsuario', 'like', '%Pendente%')
        const obj = {up: usuariosPendentes}
        return await view.render('home',{obj})
    }
    async postConfirmRegister({ view, auth, response, request, params:id }){
        const usuarioPendente = await User.findBy('id',id.idUsuario)
        await usuarioPendente.merge({statusUsuario:'Ativo'})
        await usuarioPendente.save()
        return await view.render('home')      
    }
    async postDenyRegister(){
        
    }

}

module.exports = HomeController
