import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (props) => {

    return {
        CommandId: props.params.slug
    }
};