import { atom, useAtom } from 'jotai';
const ModalState = atom(false);

export const useCreateWorkspaceModal = () => {
        return useAtom(ModalState);
};
