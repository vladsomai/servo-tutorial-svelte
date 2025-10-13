import type { IGoraApi } from "$lib/client-server-lib/api/gora/IGora"
import type { ConversationType } from "$lib/client-server-lib/types"
import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { IsValidString } from "$lib/client-server-lib/utils";

export class ServerOpenAi implements IGoraApi {
    public async AskGora(conversation: ConversationType[]): Promise<ConversationType> {
        return new Promise<ConversationType>(async (resolve) => {

            const errMsg = 'Sorry, I encountered an error while trying to answer your question.'
            const genericErr: ConversationType = { content: errMsg, role: 'assistant' }

            try {
                const openai = new OpenAI({
                    apiKey: OPENAI_API_KEY,
                });

                const response = await openai.responses.create({
                    prompt: {
                        "id": "pmpt_68ecaf50a6b48194afdc2fb2eba15ce80c7edac36514e09a",
                        "version": "8"
                    },
                    reasoning: { effort: "minimal" },
                    input: conversation,
                }).catch((err) => {
                    console.log("openai.responses.create threw:", err)
                    return { output_text: errMsg }
                });

                if (!IsValidString(response.output_text)) {
                    resolve(genericErr)
                }
                else {
                    const res: ConversationType = { role: 'assistant', content: response.output_text }
                    resolve(res)
                }

            } catch (error) {
                console.error('Error calling OPENAI API:', error);
                resolve(genericErr)
            }
        })
    }
}
