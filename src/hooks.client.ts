import type { ClientInit } from "@sveltejs/kit";

export const init: ClientInit = () => {
    console.log("Client init done")
};