'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Defesa = use('App/Models/Defesa')
const Banca = use('App/Models/Banca')
const Hash = use('Hash')

class HomeController {

    async view( {auth, view, response} ){
        let obj = {}
        if(auth.user.idPerfil ==1){
            const usuariosPendentes = 
                await Database
                    .from('Usuario')
                    .join('Perfil','Usuario.idPerfil','=','Perfil.idPerfil')
                    .select('Usuario.*')
                    .select('Perfil.nomePerfil')
                    .where('statusUsuario', 'like', '%Pendente%')
            obj = {up: usuariosPendentes}
        } else if (auth.user.idPerfil == 2){
            const defesaExistente = 
                await Database
                    .from('Defesa')
                    .join('Banca','Defesa.idBanca','=','Banca.idBanca')
                    .leftJoin('Usuario as PO','Banca.IdOrientador','=','PO.id')
                    .leftJoin('Usuario as CA','Banca.IdConvidadoA','=','CA.id')
                    .leftJoin('Usuario as CB','Banca.IdConvidadoB','=','CB.id')
                    .select('Defesa.*')
                    .select('PO.nomeUsuario as nomeOrientador')
                    .select('CA.nomeUsuario as nomeConvidadoA')
                    .select('CB.nomeUsuario as nomeConvidadoB')
                    .select('Banca.*')
                    .where('idEstudante','=',auth.user.id)
            obj = {de: defesaExistente}
        }
        console.log(obj)
        return await view.render('home',{obj})
    }
    async postConfirmRegister({ view, auth, response, request, params:u }){
        const usuarioPendente = await User.findBy('id',u.idUsuario)
        await usuarioPendente.merge({statusUsuario:'Ativo'})
        await usuarioPendente.save()
        return await view.render('home')      
    }
    async postDenyRegister({ view, auth, response, request, params:u }){
        const usuarioPendente = await User.findBy('id',u.idUsuario)
        await usuarioPendente.delete()
        await usuarioPendente.save()
        return await view.render('home')   
    }
    async validaProfessor({email: e,idPerfil: p}){
        const professor =
        await Database
            .from('Usuario')
            .select('idUsuario')
            .where((query) => {
                query
                .where('idPerfil','=',p)
                .where('ehInterno','=',1)
                .where('email','like',e)
              })
        return professor
    }
    async postCriaDefesa({ auth, request, session, response }) {
        const all = request.all()
        const orientador = await Database
            .from('Usuario')
            .select('id')
            .select('nomeUsuario')
            .where((query) => {
                query
                .where('idPerfil','=',3)
                .where('ehInterno','=',1)
                .where('email','like',all.emailOrientador)
            })
        let banca
        let erroOrientador = ''
        if (orientador[0] == undefined){
            erroOrientador = 'O Orientador informado não está presente em nosso banco.Verifique a ortografia ou entre em contato com ele para saber se ele se encontra no sistema.'
            banca = await Banca.create({
                idOrientador: null,
                statusOrientador: null,
                idConvidadoA: null,
                statusConvidadoA: null,
                idConvidadoB: null,
                statusConvidadoB: null
            })
        }else{
            banca = await Banca.create({
                idOrientador: orientador[0].id,
                statusOrientador: 'Aprovação Pendente',
                idConvidadoA: null,
                statusConvidadoA: null,
                idConvidadoB: null,
                statusConvidadoB: null
            })
        }
        const defesa = await Defesa.create({
            dataDefesa: all.dataDefesa,
            local: all.local,
            titulo: all.titulo,
            descricao: all.descricao,
            tags: all.tags,
            idEstudante: auth.user.id,
            idBanca: banca.id  
        })
        session.flash({ successmessage: 'Defesa Criada com Sucesso. ' + erroOrientador})
        return response.route('/home');
    }
    async getDefesa({ auth, params:defe, view }){
        const defesa = 
                await Database
                    .from('Defesa')
                    .join('Banca','Defesa.idBanca','=','Banca.idBanca')
                    .leftJoin('Usuario as PO','Banca.IdOrientador','=','PO.id')
                    .leftJoin('Usuario as CA','Banca.IdConvidadoA','=','CA.id')
                    .leftJoin('Usuario as CB','Banca.IdConvidadoB','=','CB.id')
                    .select('Defesa.*')
                    .select('PO.nomeUsuario as nomeOrientador')
                    .select('CA.nomeUsuario as nomeConvidadoA')
                    .select('CB.nomeUsuario as nomeConvidadoB')
                    .select('Banca.*')
                    .where('idDefesa','=',defe.idDefesa)
                    console.log(defesa)
        const obj = {defesa: defesa}
        return await view.render('edit',{obj})
    }
    async alteraDefesa({ request, auth, params: d, view, session, response } ){
        const all = request.all()
        const defesa = await Defesa.findByOrFail('idDefesa',d.idDefesa)
        await Defesa.query().where('idDefesa',d.idDefesa).update({
            idDefesa: defesa.idDefesa,
            dataDefesa: all.dataDefesa,
            local: all.local,
            titulo: all.titulo,
            descricao: all.descricao,
            tags: all.tags,
        })
        const orientador = await Database
            .from('Usuario')
            .select('id')
            .select('nomeUsuario')
            .where((query) => {
                query
                .where('idPerfil','=',3)
                .where('ehInterno','=',1)
                .where('email','like',all.emailOrientador)
            })
        let erroOrientador = ''
        if (orientador[0] == undefined){
            erroOrientador = 'O Orientador informado não está no sistema. Verifique a ortografia ou entre em contato com ele para saber se ele se encontra no sistema.'
        }else{
            await Banca.query().where('idBanca',defesa.idBanca).update({
                idOrientador: orientador[0].id,
                statusOrientador: 'Aprovação Pendente',
                idConvidadoA: null,
                statusConvidadoA: null,
                idConvidadoB: null,
                statusConvidadoB: null
            })
        }
        session.flash({ successmessage: 'Defesa Atualizada com Sucesso.'})
        return response.route('/home');
    }
}

module.exports = HomeController
