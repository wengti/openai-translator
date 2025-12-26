import {conversation, openai} from './ai.js'

let selectedLanguage = 'japanese'
const flagBtnArr = document.querySelectorAll('.flag-btn')
const sendBtn = document.querySelector('.input-container > button')
const textAreaEl = document.querySelector('textarea')
const chatInnerContainer = document.getElementById('chat-inner-container')


let isNewConversation = true


flagBtnArr.forEach(btn => {
    btn.addEventListener('click', handleLangChange)
})

sendBtn.addEventListener('click', handleSendMsg)


function handleLangChange(event) {
    event.preventDefault()

    flagBtnArr.forEach(btn => {
        btn.classList.remove('default-lang')
    })

    const targetElement = event.target.dataset.language ? event.target : event.target.parentElement
    targetElement.classList.add('default-lang')
    selectedLanguage = targetElement.dataset.language
}

async function handleSendMsg() {
    const userText = textAreaEl.value
    textAreaEl.value = ''

    if(isNewConversation){
        chatInnerContainer.innerHTML = ''
        isNewConversation = false
    }
    
    const htmlStr = `
        <div class='chat-box ai-chat last-ai-chat'>
            Thinking...
        </div>

        <div class='chat-box user-chat'>
            ${userText}
        </div>
    `
    chatInnerContainer.innerHTML = htmlStr + chatInnerContainer.innerHTML

    const response = await openai.responses.create({
        model: 'gpt-4.1',
        input: `language: ${selectedLanguage} userQuery: ${userText}`,
        conversation: conversation.id
    })

    const answer = response.output_text
    document.querySelector('.last-ai-chat').textContent = answer
}
