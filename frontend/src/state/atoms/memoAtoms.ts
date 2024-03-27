import { atom } from "recoil";

// Memoの状態を表すatom
export const memoStateAtom = atom({
	key: "memoState",
	default: {}, // この部分は実際の初期状態に応じて調整してください
});
