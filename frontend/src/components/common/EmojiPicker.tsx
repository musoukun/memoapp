/* eslint-disable prefer-const */
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Picker from "@emoji-mart/react";
import { Emoji } from "emoji-mart/dist-es/utils/data";

const EmojiPicker: React.FC<{
	icon: string;
	onChange: (emoji: string) => void;
}> = (props) => {
	const [selectedEmoji, setSelectedEmoji] = useState<string>("");
	const [isShowPicker, setIsShowPicker] = useState<boolean>(false); // 絵文字ピッカーの表示状態を管理するステート

	// 絵文字ピッカーを表示する関数
	const showPicker = () => {
		setIsShowPicker(!isShowPicker); // 絵文字ピッカーの表示状態を反転(true⇔false)
	};

	const selectEmoji = (e: Emoji) => {
		//unknown型を指定しているが、実際にはstring[]型であるため、as unknown as string[]で型変換している
		const emojiCode: string[] | undefined = e.unified?.split("-");

		let codesArray: number[] = []; // 絵文字のコードを格納する配列

		if (emojiCode) {
			emojiCode.forEach((code: string) =>
				codesArray.push(Number("0x" + code))
			); // 絵文字のコードを配列に追加
		}

		const emoji = String.fromCodePoint(...codesArray);
		setSelectedEmoji(emoji);
		props.onChange(emoji); // 親コンポーネントに選択した絵文字を渡す
		setIsShowPicker(false); // 絵文字ピッカーを非表示に
	};

	useEffect(() => {
		// props.iconが変更されたときにselectedEmojiを更新
		setSelectedEmoji(props.icon);
	}, [props.icon]);

	return (
		<Box>
			<Typography
				variant="h3"
				fontWeight={700}
				sx={{ cursor: "pointer" }}
				onClick={showPicker}
			>
				{selectedEmoji}
			</Typography>
			<Box
				sx={{
					display: isShowPicker ? "block" : "none",
					position: "absolute", // 絵文字ピッカーを固定表示
					zIndex: 100, // 絵文字ピッカーを最前面に表示
				}}
			>
				<Picker onEmojiSelect={selectEmoji} />
			</Box>
		</Box>
	);
};

export default EmojiPicker;
