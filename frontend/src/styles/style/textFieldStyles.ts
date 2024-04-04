const textFieldStyles = {
	// ベースのスタイル
	width: "100%", // 幅を100%に設定
	margin: 0, // マージンなし
	padding: 0, // パディングなし
	"& .MuiInputBase-input": {
		color: "glay", // テキストカラー
		// カーソルのカラーは、編集中のみ白色にすることで、背景に溶け込ませる
		caretColor: "glay", // カーソルの色
		margin: 0, // マージンなし
		padding: 0, // パディングなし
	},
	// ボーダーの枠線を持つルート要素のスタイル
	"& .MuiOutlinedInput-root": {
		marginLeft: 2, // 左側のマージン
		padding: 0, // パディングなし
		"& fieldset": {
			borderColor: "transparent", // 枠線を透明に
		},
		"&:hover fieldset": {
			borderColor: "transparent", // ホバー時も枠線を透明に
		},
		"&.Mui-focused fieldset": {
			borderColor: "transparent", // フォーカス時も枠線を透明に
		},
	},
	// プレースホルダーのスタイル
	"& .MuiInputLabel-outlined": {
		color: "gray", // プレースホルダーの色
		"&.Mui-focused": {
			color: "glay", // フォーカス時のプレースホルダーの色
		},
	},
};

export default textFieldStyles;
