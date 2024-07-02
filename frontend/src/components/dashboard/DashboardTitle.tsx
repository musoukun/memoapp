import React from "react";

interface DashboardTitleProps {
	title: string;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({ title }) => {
	return (
		<h1 className="text-4xl font-bold font-sans mb-8 text-white">
			{title}
		</h1>
	);
};

export default DashboardTitle;
