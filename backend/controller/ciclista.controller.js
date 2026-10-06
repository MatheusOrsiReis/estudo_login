const Ciclista = require('../models/Ciclista')

const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo' // deve ficar no arquivo .env

const cadastrar = async (req,res)=>{
    const valores = req.body
    console.log(valores)

    if( !valores.nome || !valores.email || !valores.senha ||
        !valores.cpf  || !valores.endereco || !valores.celular){

        return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    if( valores.cpf.length !== 11 ){
        return res.status(400).json({message: 'CPF inválido!'})
    }


    try{
        const cpfCripto = cryptoJs.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCripto = cryptoJs.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Ciclista.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCripto,
            cpf: cpfCripto,
            endereco: valores.endereco,
            celular: valores.celular
        })

        res.status(201).json({message: 'Ciclista cadastrados com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar o Ciclista',err)
        res.status(500).json({message: 'Erro ao cadastrar o Ciclista'})        
    }
}

const consultarID = async (req,res)=>{
    const id = req.params.id

    try{
        const ciclista = await Ciclista.findByPk(id)

        if(!ciclista){
            return res.status(404).json({message: "Ciclista não encontrado!"})
        }

        const bytes = cryptoJs.AES.decrypt(ciclista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)

        return res.status(200).json({
            codigo_ciclista : ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular

        })
    }catch(err){
        console.error('Erro ao consultar o ciclista!',err)
        res.status(500),json({message: 'Erro ao consultar o ciclista!'})
    }
}

const consultarNome = async (req,res)=>{
    const nome = req.params.nome

    try{
        const ciclista = await Ciclista.findOne({ where: { nome: nome}})

        if(!ciclista){
            return res.status(404).json({message: "Ciclista não encontrado!"})
        }
        const bytes = cryptoJs.AES.decrypt(ciclista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)

        return res.status(200).json({
            codigo_ciclista : ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular

        })

    }catch(err){
        console.error('Erro ao consultar o ciclista!',err)
        res.status(500),json({message: 'Erro ao consultar o ciclista!'})
    }
}

const apagar = async (req,res)=>{
     const id = req.params.id

    try{
        const ciclista = await Ciclista.findByPk(id)

        if(!ciclista){
            return res.status(404).json({message: "Ciclista não encontrado!"})
        }

        await Ciclista.destroy({ where: { codCiclista: id}})

        return res.status(200).json({message: 'Ciclista excluído com sucesso!' })
    }catch(err){
        console.error('Erro ao apagar o ciclista!',err)
        res.status(500),json({message: 'Erro ao apagar o ciclista!'})
    }
}

const listar = async (req,res)=>{
    try{
        const ciclistas = await Ciclista.findAll()
        let resultado = []
        let cpfDescriptografado = ''

        ciclistas.forEach((el)=>{
            const bytes = cryptoJs.AES.decrypt(el.cpf, CHAVE_SECRETA)
            cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)

            resultado.push({
                codigo_ciclista : el.codCiclista,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                endereco: el.endereco,
                celular: el.celular
            })
        })

        res.status(200).json(resultado)

    }catch(err){
        console.error('Erro ao listar o ciclista!',err)
        res.status(500).json({message: 'Erro ao listar o ciclista!'})
    }
}

module.exports = { cadastrar, consultarID, consultarNome, apagar, listar }