/* eslint-disable @typescript-eslint/no-unused-vars */
// メモのデータ構造を表す型
type Memo = {
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
type GetMemoResponse = {
	data: Memo;
};

// メモ更新APIのリクエストの型
type UpdateMemoRequest = {
	title: string;
	description: string;
};

// メモ更新APIのレスポンスの型
type UpdateMemoResponse = {
	data: Memo; // 更新されたメモのデータ
};

// メモ削除APIのレスポンスの型（成功時のステータスコードやメッセージなどに応じて定義）
type DeleteMemoResponse = {
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

type ErrorResponse = {
	message: string;
};

type UpdateMemoBody = {
	title: string;
	description: string;
	favorite?: boolean;
};

type MemoPositionUpdateBody = {
	memos: { id: string }[];
};

interface CustomRequest<T> {
	user?: { id: string };
	body: T | ReadableStream<Uint8Array> | null;
	params: { memoId?: string };
}

export type {
	Memo,
	CustomRequest,
	UpdateMemoBody,
	MemoPositionUpdateBody,
	GetMemoResponse,
	UpdateMemoRequest,
	UpdateMemoResponse,
	DeleteMemoResponse,
	RegisterParams,
	LoginParams,
	AuthResponse,
	ErrorResponse,
};
