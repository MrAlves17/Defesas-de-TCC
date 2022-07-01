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
        return await view.render('home',{obj})
    }
    async postConfirmRegister({ response, params:id, session }){
        const usuarioPendente = await User.findBy('id',id.idUsuario)
        await usuarioPendente.merge({statusUsuario:'Ativo'})
        await usuarioPendente.save()
        session.flash({ successmessage: "Cadastro de "+usuarioPendente.nomeUsuario+" aceito"})
        return await response.route('/home')      
    }
    async postDenyRegister({ response, params:id, session }){
        const usuarioPendente = await User.findBy('id',id.idUsuario)
        await usuarioPendente.delete()
        await usuarioPendente.save()
        session.flash({ successmessage: "Cadastro de "+usuarioPendente.nomeUsuario+" recusado"})
        return await response.route('/home')   
    }
    async postCriaDefesa({ auth, request, session, response }) {
        const all = request.all()       
        const banca = await Banca.create({
            idOrientador: parseInt(all.idOrientador),
            statusOrientador: all.statusOrientador,
            idConvidadoA: parseInt(all.idConvidadoA),
            statusConvidadoA: all.statusConvidadoA,
            idConvidadoB: parseInt(all.idConvidadoB),
            statusConvidadoB: all.statusConvidadoB
        })
        const defesa = await Defesa.create({
            dataDefesa: all.dataDefesa,
            local: all.local,
            titulo: all.titulo,
            descricao: all.descricao,
            tags: all.tags,
            idEstudante: auth.user.id,
            idBanca: banca.id  
        })
        session.flash({ successmessage: 'Defesa Criada com Sucesso.'})
        return response.route('/home');
    }
}

module.exports = HomeController
