'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {

    async postLogin({request, auth, response, view}){
        const loginData = request.only(['email','senha'])

        const user = await User.findBy('email', loginData.email)
        if (!(await Hash.verify(loginData.senha, user.senha))) {
            return response.badRequest('Credenciais não conferem')
        }else if (await (user.statusUsuario != 'Ativo')) {
            return response.badRequest('Usuario não está Ativo. Contate o Administrador')
        }
        await auth.loginViaId(user.id)
        // const view = await response.view('home', user)
        // return response.send(view)
        return response.route('home')
    }

    async logout ({ auth, response }) {
        await auth.logout()
        return response.route('/')
    }

    async postRegister({ request, session, response }) {
        const all = request.all()

        // console.log(all)
        // console.log(optionsPerfil.selectedIndex)
        // console.log(optionsPerfil[optionsPerfil.selectedIndex].value)
       
        const user = await User.create({
            nomeUsuario: all.nomeUsuario,
            email: all.email,
            senha: all.senha,
            matricula: all.matricula,
            idPerfil: parseInt(all.idPerfil),
            ehInterno: parseInt(all.ehInterno)
        })
        session.flash({ successmessage: 'Usuário Criado com Sucesso. Aguardando ativação por parte do Administrador'})
        return response.route('/');
    }

    async postConfirmRegister(){
        
    }
    async postDenyRegister(){
        
    }
}

module.exports = AuthController
