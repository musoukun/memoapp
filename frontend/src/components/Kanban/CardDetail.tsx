// CardDetails.tsx
import React from "react";
import { Card } from "../../types/kanban";

interface CardDetailsProps {
	card: Card;
	onClose: () => void;
	onInputChange: (field: keyof Card, value: string) => void;
}

export function CardDetails({
	card,
	onClose,
	onInputChange,
}: CardDetailsProps) {
	return (
		<div className="fixed top-0 right-0 w-[400px] h-full bg-[#161b22] p-4 overflow-y-auto">
			<div className="flex justify-between items-center mb-4">
				<span className="text-xl font-bold text-[#c9d1d9]">
					{card.title}
				</span>
				<button onClick={onClose} className="text-[#c9d1d9]">
					✖
				</button>
			</div>
			<div className="space-y-4">
				<div>
					<label className="block text-[#c9d1d9] mb-1">
						ステータス
					</label>
					<select
						value={card.status || ""}
						onChange={(e) =>
							onInputChange("status", e.target.value)
						}
						className="w-full bg-[#0d1117] text-[#c9d1d9] p-2 rounded"
					>
						<option value="">選択してください</option>
						<option value="未着手">未着手</option>
						<option value="進行中">進行中</option>
						<option value="完了">完了</option>
					</select>
				</div>
				<div>
					<label className="block text-[#c9d1d9] mb-1">担当者</label>
					<input
						type="text"
						value={card.assignee || ""}
						onChange={(e) =>
							onInputChange("assignee", e.target.value)
						}
						className="w-full bg-[#0d1117] text-[#c9d1d9] p-2 rounded"
					/>
				</div>
				<div>
					<label className="block text-[#c9d1d9] mb-1">日付</label>
					<input
						type="date"
						value={card.dueDate || ""}
						onChange={(e) =>
							onInputChange("dueDate", e.target.value)
						}
						className="w-full bg-[#0d1117] text-[#c9d1d9] p-2 rounded"
					/>
				</div>
				<div>
					<label className="block text-[#c9d1d9] mb-1">メモ</label>
					<textarea
						value={card.notes || ""}
						onChange={(e) => onInputChange("notes", e.target.value)}
						className="w-full bg-[#0d1117] text-[#c9d1d9] p-2 rounded h-32"
					/>
				</div>
			</div>
		</div>
	);
}
