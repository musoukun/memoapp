import { atom } from "recoil";

type User = {
	id: string;
	username: string;
};
// Userの状態を表すatomの定義
export const userStateAtom = atom<User>({
	key: "userState", // このatomの一意のID
	default: {
		id: "",
		username: "",
	}, // 初期状態
});

export const authLoadingAtom = atom<boolean>({
	key: "authLoading",
	default: true,
});
