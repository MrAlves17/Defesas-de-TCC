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
        session.flash({ successmessage: 'Defesa Criada com Sucesso. '})
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
            tags: all.tags
        })
        // const defesa = await Defesa.findByOrFail('idDefesa',d.idDefesa)
        // console.log('defesa 1')
        // console.log(defesa)
        // await defesa.merge({
        //     idDefesa: defesa.idDefesa,
        //     dataDefesa: all.dataDefesa,
        //     local: all.local,
        //     titulo: all.titulo,
        //     descricao: all.descricao,
        //     tags: all.tags
        // })
        // console.log('defesa 2')
        // console.log(defesa)
        // await defesa.save()
        session.flash({ successmessage: 'Defesa Atualizada com Sucesso.'})
        return response.route('/home');
    }
}

module.exports = HomeController
