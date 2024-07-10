import { atom } from "recoil";
import { Kanban } from "../types/kanban";

export const userKanbansAtom = atom<Kanban[]>({
	key: "userKanbans",
	default: [],
});
