import { PartialBlock } from "@blocknote/core";
import { atom } from "recoil";
// import { Block } from "@blocknote/core";

// Descriptionの状態を表すatom
export const descriptionStateAtom = atom<string>({
	key: "descriptionState",
	default: "", // この部分も実際の初期状態に応じて調整してください
});

export const initialContentStateAtom = atom<
	PartialBlock[] | undefined | "loading"
>({
	key: "initialContentState", // このキーはユニークでなければなりません
	default: "loading", // 初期状態
});
