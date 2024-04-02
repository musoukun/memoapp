import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";

// ReactMarkdown コンポーネントに適用するスタイル
const markdownStyles = {
	"& h1": {
		marginTop: 1, // マージンを追加
		marginBottom: 1, // マージンを追加
	},
	"& ul": {
		// 非順序付きリストのスタイル

		listStylePosition: "inside", // マーカーを内側にする
		marginLeft: "1", // マージンをリセット
		paddingLeft: "0", // パディングをリセット
	},
	"& li": {
		margin: 1,
		textAlign: "left", // テキストを左揃えにする
		// テキストのインデントを調整する場合はここに記述
	},
	"& ol": {
		// 順序付きリストのスタイル
		listStylePosition: "inside", // マーカーを内側にする
		marginLeft: "0", // マージンをリセット
		paddingLeft: "0", // パディングをリセット
	},

	// その他のMarkdown要素に対するスタイルもここに追加することができます
};

export const EditorContainer = styled(Box)({
	position: "relative",
	marginBottom: 0, // 行と行の隙間をなくす
});

export const StyledTextarea = styled(TextareaAutosize)({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	opacity: 1, // opacityを1に戻す
	zIndex: 1,
	backgroundColor: "rgba(255, 255, 255, 0.01)", // 非常に薄い背景色
	color: "transparent", // テキストカラーを透明に設定
	border: "none",
	resize: "none",
	outline: "none",
	boxShadow: "none",
});
export default markdownStyles;
