import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const instructions = `
    You are a language expert. You will be receiving 2 pieces of information, namely language and userQuery.
    Please translate the text in userQuery into the language input given by the user. If the user refers to 
    any of the message in this previous conversation, translate the referred message instead.

    Example:
    ### User-input
    language: japanese userQuery: Hello, nice to meet you!

    ### Your reply
    こんにちは、初めまして
`
let items = [
    {
        type: 'message',
        role: 'system',
        content: instructions
    }
]

export const conversation = await openai.conversations.create({
    metadata: { topic: 'translation' },
    items: items
})