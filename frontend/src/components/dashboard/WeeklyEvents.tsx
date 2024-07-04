import React, { useState } from "react";

interface Schedule {
	date: string;
	name: string;
}

interface EventsProps {
	events: {
		description: string;
		linkText: string;
		schedules: Schedule[];
	};
}

const WeeklyEvents: React.FC<EventsProps> = ({ events }) => {
	const [hiddenSection, setHiddenSection] = useState<boolean>(false);

	const toggleSection = (): void => {
		setHiddenSection(!hiddenSection);
	};

	return (
		<div className="mb-8">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold font-sans mb-4 text-white">
					今後のイベント
				</h2>
				<div className="relative">
					<i
						className="fas fa-ellipsis-h cursor-pointer text-white"
						onClick={toggleSection}
					></i>
					{hiddenSection && (
						<div className="absolute top-full right-0 mt-2 w-[150px] dark:bg-[#161b22] p-2 rounded-md shadow-lg">
							<p className="cursor-pointer text-white">
								ホームで非表示
							</p>
						</div>
					)}
				</div>
			</div>
			{!hiddenSection && (
				<div className="dark:bg-[#161b22] p-4 rounded-md flex">
					<i className="fas fa-calendar-alt text-2xl text-white"></i>
					<div className="ml-4">
						<p className="text-white">{events.description}</p>
						<p className="text-blue-500">{events.linkText}</p>
						<div>
							{events.schedules.map((schedule, index) => (
								<div
									key={index}
									className="flex justify-between my-2"
								>
									<span className="text-white">
										{schedule.date}
									</span>
									<span className="text-white">
										{schedule.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WeeklyEvents;
