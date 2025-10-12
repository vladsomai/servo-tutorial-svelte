import { Gemini } from '$lib/server/gemini/gemini';
import { error, json, type RequestHandler } from '@sveltejs/kit';


export const GET = (async (event) => {
    try {

        const params = event.url.searchParams

        if (params.size != 1) {
            error(418, "Is this a joke?")
        }

        let prompt = ""
        params.forEach(async (value, key) => {
            if (key == 'prompt') {
                prompt = value
            }
        })

        if (prompt == '') {
            error(400, "Please provide a valid prompt.")
        }

        const reply = await Gemini.AskGemini(prompt).catch(err => {
            console.log(err)
            return "Ask Gora rejected"
        })

        return json({ Reply: reply })
    } catch (err) {
        error(418, "Is this a joke?")
    }
}) satisfies RequestHandler;