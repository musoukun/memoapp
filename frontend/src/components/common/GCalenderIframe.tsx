import React from "react";

// イベントの型を定義
interface CalendarEvent {
	date: Date;
	startHour: number;
	title: string;
}

function GCalendarIframe() {
	const [weekEvents, setWeekEvents] = React.useState<CalendarEvent[]>([]);

	React.useEffect(() => {
		const fetchWeekEvents = () => {
			const today = new Date();
			const startOfWeek = new Date(
				today.setDate(today.getDate() - today.getDay())
			);
			const endOfWeek = new Date(
				today.setDate(today.getDate() - today.getDay() + 6)
			);

			const formattedStartDate = startOfWeek.toISOString().split("T")[0];
			const formattedEndDate = endOfWeek.toISOString().split("T")[0];

			fetch(
				`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${formattedStartDate}T00:00:00Z&timeMax=${formattedEndDate}T23:59:59Z&key=YOUR_API_KEY`
			)
				.then((response) => response.json())
				.then((data) => {
					const events: CalendarEvent[] = data.items.map(
						(item: any) => ({
							date: new Date(
								item.start.dateTime || item.start.date
							),
							startHour: new Date(
								item.start.dateTime || item.start.date
							).getHours(),
							title: item.summary,
						})
					);
					setWeekEvents(events);
				})
				.catch((error) =>
					console.error("Error fetching events:", error)
				);
		};

		fetchWeekEvents();
	}, []);

	// 現在の週の開始日を取得
	const getStartOfWeek = () => {
		const now = new Date();
		const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
		return startOfWeek.toISOString().split("T")[0];
	};

	return (
		<div className="font-roboto bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
			<div className="mb-4">
				<iframe
					src={`https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FTokyo&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=WEEK&dates=${getStartOfWeek()}`}
					style={{ border: 0 }}
					width="100%"
					height="300"
					frameBorder="0"
					scrolling="no"
					className="rounded-lg"
				></iframe>
			</div>
			<div className="mt-4">
				<h2 className="text-lg font-semibold mb-2">今週の予定</h2>
				<ul className="space-y-1">
					{weekEvents.map((event, index) => (
						<li key={index} className="flex items-center text-sm">
							<span className="w-32 text-gray-500">
								{event.date.toLocaleDateString()}{" "}
								{event.startHour.toString().padStart(2, "0")}:00
							</span>
							<span className="font-medium">{event.title}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default GCalendarIframe;
