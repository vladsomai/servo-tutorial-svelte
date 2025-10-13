import type { ConversationType } from "$lib/client-server-lib/types";

export interface IGoraApi {
    AskGora: (conversation: ConversationType[]) => Promise<ConversationType>;
}
