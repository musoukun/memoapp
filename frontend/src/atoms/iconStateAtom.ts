import { atom } from "recoil";

// Note一覧の状態を表すatom
export const iconStateAtom = atom<string>({
	key: "iconState",
	default: "", // Change the default value to an empty array
});
