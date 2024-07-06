// hooks/useNoteUpdate.ts
import { useSetRecoilState } from "recoil";
import { notesStateAtom } from "../atoms/noteAtoms";
import noteApi from "../api/noteApi";
import { Note } from "../types/api";
import { updateSidebarInfo } from "../types/api";

export const useNoteUpdate = () => {
	const setNotes = useSetRecoilState(notesStateAtom);

	const updateNote = async (id: string, updates: Partial<Note>) => {
		try {
			const updatedNote = await noteApi.update(id, updates);
			// console.log("Updated note data:", updatedNote);
			return updatedNote;
		} catch (error) {
			console.error("Failed to update note:", error);
			throw error;
		}
	};

	const updateSidebarInfo = (
		id: string,
		updates: Partial<updateSidebarInfo>
	) => {
		setNotes((prev) => {
			if (!prev) return prev;

			return prev.map((note) => {
				if (note.id === id) {
					return {
						...note,
						...updates,
						favorite: Boolean(updates.favorite),
					};
				}
				return note;
			});
		});
	};

	return { updateNote, updateSidebarInfo };
};
