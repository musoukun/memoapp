// hooks/useMemoUpdate.ts
import { useSetRecoilState } from "recoil";
import { memosStateAtom } from "../atoms/memoAtoms";
import memoApi from "../api/memoApi";
import { Memo } from "../types/api";

export const useMemoUpdate = () => {
	const setMemos = useSetRecoilState(memosStateAtom);

	const updateMemo = async (id: string, updates: Partial<Memo>) => {
		try {
			const updatedMemo = await memoApi.update(id, updates);
			// console.log("Updated memo data:", updatedMemo);
			return updatedMemo;
		} catch (error) {
			console.error("Failed to update memo:", error);
			throw error;
		}
	};

	const updateSidebarInfo = (
		id: string,
		updates: Partial<Pick<Memo, "title" | "favorite" | "icon" | "delete">>
	) => {
		setMemos((prevMemos) =>
			prevMemos.map((memo) =>
				memo.id === id ? { ...memo, ...updates } : memo
			)
		);
	};

	return { updateMemo, updateSidebarInfo };
};
