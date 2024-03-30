import { atom } from "recoil";

// Memoの状態を表すatom
export const memosStateAtom = atom<Array<any>>({
	key: "memosState",
	default: [], // Change the default value to an empty array
});
