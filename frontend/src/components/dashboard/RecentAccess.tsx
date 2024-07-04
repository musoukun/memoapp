import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import memoApi from "../../api/memoApi";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "../../atoms/userAtoms";
import { Link } from "react-router-dom";

interface RecentAccessItem {
	id: string;
	title: string;
	icon: string;
	lastAccessedAt: string;
}

const RecentAccess: React.FC = () => {
	const [recentAccess, setRecentAccess] = useState<RecentAccessItem[]>([]);
	const [hiddenSection, setHiddenSection] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const user = useRecoilValue(userStateAtom);

	useEffect(() => {
		const fetchRecentAccess = async () => {
			setIsLoading(true);
			try {
				const response = await memoApi.recent(user);
				setRecentAccess(response.data);
				setError(null);
			} catch (error) {
				console.error("Failed to fetch recent access data:", error);
				setError("Failed to load recent access data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecentAccess();
	}, []);

	const toggleSection = (): void => {
		setHiddenSection(!hiddenSection);
	};

	const handleNext = (): void => {
		if (currentPage < Math.ceil(recentAccess.length / 6) - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevious = (): void => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollLeft = 0;
		}
	}, [currentPage]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (recentAccess.length === 0) {
		return <div>No recent access data available.</div>;
	}

	return (
		<div className="mb-8">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold font-sans mb-4 text-white">
					最近のアクセス
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
				<div
					className="relative overflow-hidden"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<motion.div
						ref={containerRef}
						className="flex space-x-4 overflow-x-hidden"
						initial={false}
						animate={{ x: -currentPage * 100 + "%" }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
					>
						{recentAccess.map((item) => (
							<div
								key={item.id}
								className="bg-[#161b22] p-4 rounded-md min-w-[200px] flex-shrink-0"
							>
								<Link
									to={`/memo/${item.id}`}
									className="flex items-center space-x-2 dark:text-white"
								>
									{item.icon} {item.title}
								</Link>

								<p className="text-gray-400">
									{new Date(
										item.lastAccessedAt
									).toLocaleString()}
								</p>
							</div>
						))}
					</motion.div>
					<AnimatePresence>
						{isHovered && recentAccess.length > 6 && (
							<>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute top-1/2 left-0 transform -translate-y-1/2"
								>
									<i
										className="fas fa-chevron-left cursor-pointer text-white"
										onClick={handlePrevious}
									></i>
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute top-1/2 right-0 transform -translate-y-1/2"
								>
									<i
										className="fas fa-chevron-right cursor-pointer text-white"
										onClick={handleNext}
									></i>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
};

export default RecentAccess;
