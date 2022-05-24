import { selector } from 'recoil';
import { reservationState } from './atoms';

const countStateSelector = selector({
    key: 'CountState',

    get: ({ get }) => {
        const reservationState = get(reservationState);

        return `${reservationState}`;
    },
});

export default countStateSelector;
