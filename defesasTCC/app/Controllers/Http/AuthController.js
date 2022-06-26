'use strict'

class AuthController {
    async postLogin({request, auth, response}){
        const loginData = request.only(['email','senha'])
        console.log(loginData)
        const token = await auth.attempt(loginData.email, loginData.senha)
        const tokJson = token.toJSON()
        console.log(tokJson)
        
        const user = {nome:'Vítor'}
        // const view = await response.view('home', user)
        // return response.send(view)
        return response.route('home',{user})
    }
}

module.exports = AuthController
