import React from "react";

interface DifyChatProps {
	chatbotUrl: string;
	width?: string;
	height?: string;
}

const DifyChat: React.FC<DifyChatProps> = ({
	chatbotUrl,
	width = "100%",
	height = "600px",
}) => {
	return (
		<div className="dify-chat-container">
			<iframe
				src={chatbotUrl}
				width={width}
				height={height}
				frameBorder="0"
				allow="microphone"
				style={{ border: "none" }}
			></iframe>
		</div>
	);
};

export default DifyChat;
