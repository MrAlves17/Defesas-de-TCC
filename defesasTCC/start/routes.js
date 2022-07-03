'use strict'

const HomeController = require('../app/Controllers/Http/HomeController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('login')
Route.post('/', 'AuthController.postLogin').as('auth.postLogin')
Route.on('register').render('register')
Route.post('register', 'AuthController.postRegister').as('auth.postRegister')
Route.get('home','HomeController.view')
Route.get('logout','AuthController.logout')
Route.put('home/confirma/:idUsuario','HomeController.postConfirmRegister')
Route.put('home/remove/:idUsuario','HomeController.postDenyRegister')
Route.put('home/deactivate/:idUsuario','HomeController.postDeactivateRegister')
Route.post('home/cria/defesa','HomeController.postCriaDefesa')
Route.put('home/edita/defesa/:idDefesa','HomeController.alteraDefesa')
Route.put('home/edita/:idDefesa','HomeController.getDefesa')
Route.put('home/confirmaDefesa/:idBanca','HomeController.confirmaDefesa')
Route.put('home/recusaDefesa/:idBanca','HomeController.recusaDefesa')
