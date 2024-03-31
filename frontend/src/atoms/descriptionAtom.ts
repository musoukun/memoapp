import { atom } from "recoil";

// Descriptionの状態を表すatom
export const descriptionStateAtom = atom<string>({
	key: "descriptionState",
	default: "", // この部分も実際の初期状態に応じて調整してください
});
