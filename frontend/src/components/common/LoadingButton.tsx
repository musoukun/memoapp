import React from "react";

const LoadingButton: React.FC<{
	isLoading: boolean;
	onClick: () => void;
	children: React.ReactNode;
}> = ({ isLoading, onClick, children }) => {
	const buttonClasses =
		"relative inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50";
	const loadingIconClasses =
		"absolute left-0 inset-y-0 flex items-center pl-3";
	const loadingIcon = <i className="fa fa-spinner fa-spin text-white"></i>;
	const spanClasses = isLoading ? "opacity-0" : "";

	return (
		<button
			className={buttonClasses}
			disabled={isLoading}
			onClick={onClick}
		>
			{isLoading && (
				<span className={loadingIconClasses}>{loadingIcon}</span>
			)}
			<span className={spanClasses}>{children}</span>
		</button>
	);
};

export default LoadingButton;
