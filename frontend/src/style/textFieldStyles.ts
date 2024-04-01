// src/styles/textFieldStyles.ts

const textFieldStyles = {
	p: {
		margin: 0,
		padding: 0,
		lineHeight: "1",
	},
	"& .MuiOutlinedInput-root": {
		padding: "8px 14px",
		minHeight: "2.3vh",
		overflow: "hidden",
		backgroundColor: "transparent",
		"&:hover": {
			backgroundColor: "transparent",
		},
		"&.Mui-focused": {
			backgroundColor: "rgba(0, 0, 0, 0.1)",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},
	"& .MuiOutlinedInput-input": {
		padding: "0px",
		margin: "0px",
	},
};

export default textFieldStyles;
