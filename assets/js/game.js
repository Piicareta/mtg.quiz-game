
const pergunta = document.getElementById('pergunta')
const escolhas = Array.from(document.getElementsByClassName('escolha-texto'))
const timer = document.getElementById('timer')
const mais = document.getElementById('mais')
const menos = document.getElementById('menos')

let timerContador = 30

let perguntaAtual = {}
let respostaAceita = false
let placar = 0
let perguntaDisponivel = []

let perguntas = []

fetch('./assets/data.json')
.then( res => res.json())
.then( perguntasLoad => {
    perguntas = perguntasLoad
    startGame()
})

// Constantes

const BONUS_CORRETO = 100
const BONUS_INCORRETO = 60

setInterval (() => {

    if (timerContador <= 0){

        localStorage.setItem('ultimoPlacar', placar)

        return window.location.assign('final.html')
    }

    timer.textContent = timerContador
    placar--
    timerContador--
    timer.classList.add('timer-anima')

    setTimeout(() => {
        timer.classList.remove('timer-anima')
    }, 200)

}, 1000)

startGame = () => {

    placar = 0
    perguntaDisponivel = [...perguntas]
    
    novaPergunta()
}

novaPergunta = () => {

    const perguntaIndex = Math.floor(Math.random() * perguntaDisponivel.length)

    perguntaAtual = perguntaDisponivel[perguntaIndex]
    pergunta.textContent = perguntaAtual.pergunta

    escolhas.forEach(escolha => {

        const numero = escolha.dataset['numero']
        escolha.textContent = perguntaAtual['escolha' + numero]
    })

    perguntaDisponivel.splice(perguntaIndex, 1)

    respostaAceita = true
}

escolhas.forEach(escolha => {

    escolha.addEventListener('click', e => {

        if (!respostaAceita) return

        respostaAceita = false
        const escolhaSelecionada = e.target
        const escolhaResposta = escolhaSelecionada.dataset['numero']

        let classeAplicada = 'incorreto'

        if (escolhaResposta == perguntaAtual.resposta){
            classeAplicada = 'correto'
            timerContador += 5
            placar += BONUS_CORRETO
            mais.classList.add('mais-anima')
            setTimeout(() => {
                mais.classList.remove('mais-anima')
            }, 500)
        }
        else {
            timerContador -= 3
            placar -= BONUS_INCORRETO
            menos.classList.add('menos-anima')
            setTimeout(() => {
                menos.classList.remove('menos-anima')
            }, 500)
        }

        escolhaSelecionada.classList.add(classeAplicada)

        setTimeout( ()=> {
            escolhaSelecionada.classList.remove(classeAplicada)
            novaPergunta()
        }, 1000)

    })
})