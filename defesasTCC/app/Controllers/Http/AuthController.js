'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
    async postLogin({request, auth, response}){
        const loginData = request.only(['email','senha'])
        
        const user = await User.findBy('email', loginData.email)
        if (!(await Hash.verify(loginData.senha, user.senha))) {
            return response.badRequest('Invalid credentials')
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
}

module.exports = AuthController
