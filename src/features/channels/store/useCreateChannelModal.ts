import { atom, useAtom } from 'jotai';
const ModalState = atom(false);

export const useCreateChannelModal = () => {
        return useAtom(ModalState);
};
