import { atom } from "recoil";

// Memoの状態を表すatom
export const memosStateAtom = atom<Array<any>>({
	key: "memosState",
	default: [], // Change the default value to an empty array
});

// メモ作成フラグのatom
export const createMemoflgAtom = atom<boolean>({
	key: "createMemoflg",
	default: false,
});

// メモ更新フラグのatom
export const updateMemoflgAtom = atom<boolean>({
	key: "updateMemoflg",
	default: false,
});
