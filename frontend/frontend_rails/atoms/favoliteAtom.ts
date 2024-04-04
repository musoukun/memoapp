import { atom } from "recoil";
// Favoritesの状態を表すatom
export const favoriteStateAtom = atom<boolean>({
	key: "favoriteState",
	default: false, // この部分も実際の初期状態に応じて調整してください
});
