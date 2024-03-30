/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";
import memoApi from "../../api/memoApi";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userStateAtom } from "../../state/atoms/userAtoms";
import { createMemoflgAtom } from "../../state/atoms/memoAtoms";

const Home = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const user = useRecoilValue(userStateAtom);
	const [createMemoflg, setCreateMemoflg] = useRecoilState(createMemoflgAtom);

	const createMemo = async () => {
		console.log("create memo");
		try {
			setLoading(true);
			// メモの作成処理
			const res = await memoApi.create();
			console.log(res.data);
			navigate(`/memo/${res.data.id}`);
			setCreateMemoflg(true);
		} catch (err: any) {
			// エラー処理
			alert(err.status + ": " + err.statusText);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<LoadingButton
				variant="outlined"
				onClick={createMemo}
				loading={loading}
			>
				最初のメモを作成
			</LoadingButton>
		</Box>
	);
};
export default Home;
