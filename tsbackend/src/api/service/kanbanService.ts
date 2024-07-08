import { PrismaClient } from "@prisma/client";
import {
	ColumnUpdateInput,
	CardUpdateInput,
	KanbanUpdateInput,
	KanbanWithRelations,
} from "../../../types/kanban";

const prisma = new PrismaClient();
// kanbanのカラムとカードを更新する関数
export async function updateKanbanColumnsAndCards(
	kanbanId: string,
	userId: string,
	updateData: KanbanUpdateInput
): Promise<KanbanWithRelations> {
	const upsertAndDeleteData = await prisma.kanban.update({
		where: { id: kanbanId, userId },
		data: {
			title: updateData.title,
			columns: {
				upsert: updateData.columns.map((column, index) =>
					updateOrCreateColumn(kanbanId, column, index)
				),
			},
		},
		include: {
			columns: {
				include: {
					cards: true,
				},
			},
		},
	});
	return upsertAndDeleteData;
}

export const updateOrCreateColumn = (
	kanbanId: string,
	column: ColumnUpdateInput,
	index: number
) => ({
	where: { id: column.id || "" },
	// updateは、カラムを更新するか、カラムが存在しない場合は新しく作成する
	update: {
		title: column.title,
		order: index,
		cards: {
			// upsertは、指定された条件に一致するカードが存在する場合は更新し、存在しない場合は新しく作成する
			upsert: column.cards.map((card, cardIndex) =>
				updateOrCreateCard(card, cardIndex)
			),
			// deleteManyは、指定された条件に一致するカードを削除する
			deleteMany: {
				id: {
					notIn: column.cards
						.map((card) => card.id)
						.filter((id) => id !== undefined) as string[],
				},
			},
		},
	},
	// createは、カラムを新しく作成する
	create: {
		title: column.title,
		order: index,
		cards: {
			create: column.cards.map((card, cardIndex) =>
				createCard(card, cardIndex)
			),
		},
	},
});

export const updateOrCreateCard = (card: CardUpdateInput, index: number) => ({
	where: { id: card.id || "" },
	update: {
		title: card.title,
		order: index,
		status: card.status,
		assignee: card.assignee,
		dueDate: card.dueDate,
		notes: card.notes,
	},
	// 修正部分: createCard関数の結果を直接使用すると、idがundefinedになるため、createを使用する
	create: {
		title: card.title,
		order: index,
		status: card.status,
		assignee: card.assignee,
		dueDate: card.dueDate,
		notes: card.notes,
	},
});

export const createCard = (card: CardUpdateInput, index: number) => ({
	title: card.title,
	order: index,
	status: card.status,
	assignee: card.assignee,
	dueDate: card.dueDate,
	notes: card.notes,
});
