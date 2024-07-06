/* eslint-disable @typescript-eslint/no-unused-vars */
// メモのデータ構造を表す型
type Note = {
	id?: string; // 新規作成時にはidがないため、オプショナルとする
	title: string;
	description: string;
	icon: string;
	favorite: boolean;
	position: number;
	favoritePosition: number;
	createdAt: string;
	updatedAt: string;
};

// メモ取得APIのレスポンスの型
type GetNoteResponse = {
	data: Note;
};

// メモ更新APIのリクエストの型
type UpdateNoteRequest = {
	title: string;
	description: string;
};

// メモ更新APIのレスポンスの型
type UpdateNoteResponse = {
	data: Note; // 更新されたメモのデータ
};

type updateSidebarInfo = {
	title: string;
	icon: string;
	favorite: boolean;
	delete: boolean;
};
// メモ削除APIのレスポンスの型（成功時のステータスコードやメッセージなどに応じて定義）
type DeleteNoteResponse = {
	message: string; // 例: 'メモが削除されました'
};

type RegisterParams = {
	username: string;
	password: string;
	confirmPassword: string;
};

type LoginParams = {
	username: string;
	password: string;
};

type AuthResponse = {
	token: string;
};

type UpdateNoteBody = {
	title: string;
	description: string;
	favorite?: boolean;
};

type NotePositionUpdateBody = {
	notes: { id: string }[];
};

interface CustomRequest<T> {
	user?: { id: string };
	body: T | ReadableStream<Uint8Array> | null;
	params: { noteId?: string };
}

export type {
	Note,
	CustomRequest,
	UpdateNoteBody,
	NotePositionUpdateBody,
	GetNoteResponse,
	UpdateNoteRequest,
	UpdateNoteResponse,
	DeleteNoteResponse,
	RegisterParams,
	LoginParams,
	AuthResponse,
	updateSidebarInfo,
};
