import { atom } from "recoil";

export const titleStateAtom = atom<string>({
	// Titleの状態を表すatom
	key: "titleState",
	default: "", // この部分も実際の初期状態に応じて調整してください
});
