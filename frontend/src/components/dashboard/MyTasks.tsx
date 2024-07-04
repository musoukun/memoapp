import React, { useState } from "react";

interface Task {
	name: string;
	date: string;
	type: string;
}

interface TasksProps {
	tasks: {
		description: string;
		linkText: string;
		taskList: Task[];
	};
}

const MyTasks: React.FC<TasksProps> = ({ tasks }) => {
	const [hiddenSection, setHiddenSection] = useState<boolean>(false);

	const toggleSection = (): void => {
		setHiddenSection(!hiddenSection);
	};

	return (
		<div>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold font-sans mb-4 text-white">
					マイタスク
				</h2>
				<div className="relative">
					<i
						className="fas fa-ellipsis-h cursor-pointer text-white"
						onClick={toggleSection}
					></i>
					{hiddenSection && (
						<div className="absolute top-full right-0 mt-2 w-[150px] bg-[#2a2a2a] p-2 rounded-md shadow-lg">
							<p className="cursor-pointer text-white">
								ホームで非表示
							</p>
						</div>
					)}
				</div>
			</div>
			{!hiddenSection && (
				<div className="bg-[#161b22] p-4 rounded-md">
					<div className="flex items-center space-x-2 mb-4">
						<i className="fas fa-tasks text-2xl text-white"></i>
						<p className="text-white">{tasks.description}</p>
					</div>
					<p className="text-blue-500 mb-4">{tasks.linkText}</p>
					<div>
						{tasks.taskList.map((task, index) => (
							<div
								key={index}
								className="flex justify-between items-center my-2"
							>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										name={`task-${index}`}
										className="text-blue-500"
									/>
									<span className="text-white">
										{task.name}
									</span>
								</div>
								<span className="text-gray-400">
									{task.date}
								</span>
								<span className="text-gray-400">
									{task.type}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MyTasks;
