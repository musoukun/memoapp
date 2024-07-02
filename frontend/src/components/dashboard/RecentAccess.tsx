import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RecentAccessItem {
	name: string;
	time: string;
}

interface RecentAccessProps {
	recentAccess: RecentAccessItem[];
}

const RecentAccess: React.FC<RecentAccessProps> = ({ recentAccess }) => {
	const [hiddenSection, setHiddenSection] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

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
						{recentAccess.map((item, index) => (
							<div
								key={index}
								className="bg-[#2a2a2a] p-4 rounded-md min-w-[200px] flex-shrink-0"
							>
								<div className="flex items-center space-x-2 text-white">
									<i className="fas fa-file-alt text-xl"></i>
									<span>{item.name}</span>
								</div>
								<p className="text-gray-400">{item.time}</p>
							</div>
						))}
					</motion.div>
					<AnimatePresence>
						{isHovered && (
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
