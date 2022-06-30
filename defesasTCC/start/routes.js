'use strict'

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
const obj2 = {nome:"aaaaaa"}

Route.on('/').render('login')
Route.post('/', 'AuthController.postLogin').as('auth.postLogin')
Route.on('register').render('register')
Route.post('register', 'AuthController.postRegister').as('auth.postRegister')
Route.get('home','HomeController.view')
Route.get('logout','AuthController.logout')
Route.put('home/confirma/:idUsuario','HomeController.postConfirmRegister')
Route.put('home/remove/:idUsuario','HomeController.postDenyRegister')
