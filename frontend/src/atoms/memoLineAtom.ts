import { atom } from "recoil";
import { MemoLine } from "../types/memoLine.ts";

export const memoLineAtom = atom<MemoLine>({
	key: "memoLineAtom",
	default: {
		id: "",
		text: "",
		isFocus: false,
	},
});

export const memoLinesAtom = atom<MemoLine[]>({
	key: "memoLinesAtom",
	// このdefaultに0番目の要素を追加してください
	default: [
		{
			id: "firstLine",
			text: "",
			isFocus: false,
		},
	],
});
