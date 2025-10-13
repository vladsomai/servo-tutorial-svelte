import { GoraApiEndpoints } from "$lib/client-server-lib/api/ApiConfig"
import type { IGoraApi } from "$lib/client-server-lib/api/gora/IGora"
import type { ConversationType } from "$lib/client-server-lib/types"

export class ServerGoraApi implements IGoraApi {
    public async AskGora(conversation: ConversationType[]): Promise<ConversationType> {
        return new Promise<ConversationType>(async (resolve) => {

        })
    }
}