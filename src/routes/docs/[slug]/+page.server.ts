import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (props) => {
    return {
        CommandId: Number(props.params.slug)
    }
};