const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

let resposta_consultID = document.getElementById('resposta_consultID')
let btn_consultarID = document.getElementById('btn_consultarID')

btn_consultarID.addEventListener('click', (e) => {
    e.preventDefault()

    let id = Number(document.getElementById('id').value)
    console.log(id)

    fetch(`http://localhost:3000/ciclista/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => {
            console.log('res', res)
            return res.json()

        })
        .then(dadosArr => {
            console.log(dadosArr)

            resposta_consultID.innerHTML = ``
            resposta_consultID.innerHTML += `
                    <table>
                    ${criarThead()}
                    ${criarTbody([dadosArr])}
                    </table>
            `
        })
        .catch((err) => {
            console.error('Erro ao consultar o Ciclista', err)
            resposta_consultID.innerHTML += `Erro ao consultar o Ciclista`
        })
})

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Endereco</th>
                <th>Celular</th>
            </tr>
        </thead>
    `
}

function criarTbody(dados) {
    let corpo = ''
    corpo += `<tbody>`
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codCiclista}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.cpf}</td>`
        corpo += `<td>${el.endereco}</td>`
        corpo += `<td>${el.celular}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}