let selectedLanguage = 'japanese'
const flagBtnArr = document.querySelectorAll('.flag-btn')
const sendBtn = document.querySelector('.input-container > button')
const textAreaEl = document.querySelector('textarea')
const chatInnerContainer = document.getElementById('chat-inner-container')

let isNewConversation = true


// Create a new conversation
const conversationOption = {
    method: 'POST',
    body: JSON.stringify({
        action: 'createConversation'
    }),
    headers: {
        'Content-Type': 'application/json'
    }
}
const workerUrl = 'https://openai-translator-openai-worker.cloudflare-demo-wengti.workers.dev/'
const response = await fetch(workerUrl, conversationOption)
const data = await response.json()

if (!response.ok) {
    throw new Error(`Error: ${data.errorMsg}`)
}
const { conversationId } = data



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
    sendBtn.disabled = true
    const userText = textAreaEl.value
    textAreaEl.value = ''

    if (isNewConversation) {
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
    chatInnerContainer.scrollTop += chatInnerContainer.scrollHeight

    const responseOption = {
        method: 'POST',
        body: JSON.stringify({
            action: 'createResponse',
            selectedLanguage: selectedLanguage,
            userText: userText,
            conversationId: conversationId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(workerUrl, responseOption)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(`Error: ${data.errorMsg}`)
    }
    const { responseByAi: answer } = data
    document.querySelector('.last-ai-chat').textContent = answer
    sendBtn.disabled = false
}
