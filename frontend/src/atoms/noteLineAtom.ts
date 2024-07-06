import { atom } from "recoil";
import { NoteLine } from "../types/noteLine.ts";

export const noteLineAtom = atom<NoteLine>({
	key: "noteLineAtom",
	default: {
		id: "",
		text: "",
		isFocus: false,
	},
});

export const noteLinesAtom = atom<NoteLine[]>({
	key: "noteLinesAtom",
	// このdefaultに0番目の要素を追加してください
	default: [
		{
			id: "firstLine",
			text: "",
			isFocus: false,
		},
	],
});
