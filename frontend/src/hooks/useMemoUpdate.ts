// hooks/useNoteUpdate.ts
import { useSetRecoilState } from "recoil";
import { notesStateAtom } from "../atoms/noteAtoms";
import noteApi from "../api/noteApi";
import { Note } from "../types/api";

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
		updates: Partial<Pick<Note, "title" | "favorite" | "icon" | "delete">>
	) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id ? { ...note, ...updates } : note
			)
		);
	};

	return { updateNote, updateSidebarInfo };
};
