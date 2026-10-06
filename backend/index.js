const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

// relacionamentos para poder trabalhar os relacionamentos
// require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const ciclistaController = require('./controller/ciclista.controller')
const authController = require('./controller/auth.controller')


// ------------ Middleware ------------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// ------- Rotas Públicas ------
app.post('/ciclista', ciclistaController.cadastrar)
app.post('/login', authController.login)

// ----- Middleware que verifica se tem o token ---------
app.use(authMiddleware)
// ------- Rotas Privadas -------

app.get('/ciclistas', ciclistaController.listar)
app.get('/ciclista/buscarNome/:nome', ciclistaController.consultarNome)
app.get('/ciclista/:id', ciclistaController.consultarID)
app.delete('/ciclista/:id', ciclistaController.apagar)


app.get('/', (req,res)=>{
    res.status(200).json({message: "Aplicação rodando!"})
})

// Rotas Privadas



// ----- sincronizando o servidor com o Banco de Dados -----
conn.sync()
    .then(()=>{
        app.listen(PORT, hostname, ()=>{
            console.log(`Servidor rodando em ${hostname}:${PORT}`)
        })
    })
    .catch((err)=>{
        console.error('Erro ao conectar com o banco de dados!',err)
    })

