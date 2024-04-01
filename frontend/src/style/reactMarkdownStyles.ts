// ReactMarkdown コンポーネントに適用するスタイル
const markdownStyles = {
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
export default markdownStyles;
