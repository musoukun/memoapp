export const mockKanbanData = {
	id: "kanban-1",
	title: "Project Alpha",
	columns: [
		{
			id: "column-1",
			title: "To Do",
			cards: [
				{
					id: "card-1",
					title: "Research competitors",
					description: "Analyze top 5 competitors in the market",
					status: "To Do",
				},
				{
					id: "card-2",
					title: "Design user interface",
					description: "Create wireframes for the main pages",
					status: "To Do",
				},
			],
		},
		{
			id: "column-2",
			title: "In Progress",
			cards: [
				{
					id: "card-3",
					title: "Implement login functionality",
					description: "Set up authentication system",
					status: "In Progress",
				},
				{
					id: "card-4",
					title: "Develop API endpoints",
					description: "Create RESTful API for user management",
					status: "In Progress",
				},
			],
		},
		{
			id: "column-3",
			title: "Done",
			cards: [
				{
					id: "card-5",
					title: "Set up project repository",
					description: "Initialize Git repo and invite team members",
					status: "Done",
				},
			],
		},
	],
};
