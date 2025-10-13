import type { ConversationRoleType, ConversationType } from '$lib/client-server-lib/types';
import { IsValidString } from '$lib/client-server-lib/utils';
import { ServerOpenAi } from '$lib/server/api/gora/OpenAi';
import { error, json, type RequestHandler } from '@sveltejs/kit';


export const POST = (async (event) => {
    try {
        const formData = await event.request.formData()
        
        const conversation_length_str = formData.get("conversation_length") as string
        
        if (!IsValidString(conversation_length_str)) {
            throw error(400, { message: "Invalid params" });
        }

        const conversation_length: number = Number.parseInt(conversation_length_str)
        const conversation: ConversationType[] = []

        for (let i = 0; i < conversation_length; i++) {
            const incoming_role = formData.get(`conversation[${i}][role]`) as ConversationRoleType
            const incoming_content = formData.get(`conversation[${i}][content]`) as string

            if (!IsValidString(incoming_role) ||

                (incoming_role != 'user' && incoming_role != 'assistant')) {
                throw Error("Invalid parameters, role is not supported")
            }

            const conv: ConversationType = {
                role: incoming_role,
                content: incoming_content
            }

            conversation.push(conv)
        }

        const serverOpenAi = new ServerOpenAi()
        const reply = await serverOpenAi.AskGora(conversation)

        return json(reply)

    } catch (err) {
        throw error(400, { message: String(err) });
    }

    throw error(400, { message: "Something went wrong!" });
}) satisfies RequestHandler;