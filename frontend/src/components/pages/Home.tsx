import React from "react";
import DashboardTitle from "../dashboard/DashboardTitle";
import RecentAccess from "../dashboard/RecentAccess";

import MyTasks from "../dashboard/MyTasks";
import GCalendarIframe from "../common/GCalenderIframe";

interface HomeProps {
	title: string;
	recentAccess: Array<{ name: string; time: string }>;
	events: {
		description: string;
		linkText: string;
		schedules: Array<{ date: string; name: string }>;
	};
	tasks: {
		description: string;
		linkText: string;
		taskList: Array<{ name: string; date: string; type: string }>;
	};
}

const Home: React.FC<HomeProps> = ({ title, tasks }) => {
	return (
		<div className="dark:bg-gray-800 min-h-screen p-6">
			<DashboardTitle title={title} />
			<RecentAccess />
			<GCalendarIframe />
			<MyTasks tasks={tasks} />
		</div>
	);
};

export default Home;
