import type { ConversationType } from "$lib/client-server-lib/types";
import { GoraApiEndpoints } from "../ApiConfig";
import type { IGoraApi } from "./IGora";


export class ClientGoraApi implements IGoraApi {
    public async AskGora(conversation: ConversationType[]): Promise<ConversationType> {
        return new Promise<ConversationType>(async (resolve) => {
            const formData = new FormData()

            formData.append("conversation_length", `${conversation.length}`)

            conversation.forEach((message, index) => {
                formData.append(`conversation[${index}][role]`, message.role);
                formData.append(`conversation[${index}][content]`, message.content);
            });

            const fRes: ConversationType = await (await fetch(GoraApiEndpoints.AskGora, {
                method: 'POST',
                body: formData,
            })).json()
                .catch((err): ConversationType => {
                    console.log("AskGora rejected: ", err)

                    return { role: "assistant", content: "An error occurred." }
                }) as ConversationType

            resolve(fRes)

        })
    }
}