import { Box } from "@mui/system";
import { IconButton, TextField } from "@mui/material";
import { DeleteOutline, StarBorderOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import memoApi from "../../api/memoApi";

const Memo = () => {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		const getMemo = async () => {
			try {
				const res = await memoApi.show(id as string);
				console.log(res.data);
				setTitle(res.data.title);
				setDescription(res.data.description);
			} catch (err: any) {
				alert(err.status + ": " + err.statusText);
			}
		};
		getMemo();
	}, [id]);

	let timer: number;
	const timeout = 4000;

	const updateTitle = (e: any) => {
		clearTimeout(timer); // 0.5秒を過ぎたらAPIを叩く、それまでの入力ではApiを叩かない仕組み
		// Copilot最高！
		const newTitle = e.target.value;
		setTitle(newTitle);
		timer = window.setTimeout(async () => {
			try {
				memoApi.update(id as string, { title: newTitle });
				console.log("update title");
			} catch (err: any) {
				alert(err.status + ": " + err.statusText);
			}
		}, timeout);
	};

	const updateDescription = (e: any) => {
		clearTimeout(timer);
		const newDescription = e.target.value;
		setDescription(newDescription);
		timer = window.setTimeout(async () => {
			try {
				memoApi.update(id as string, { description: newDescription });
				console.log("update description");
			} catch (err: any) {
				alert(err.status + ": " + err.statusText);
			}
		}, timeout);
	};

	return (
		<>
			<Box
				sx={{
					diplay: "flex",
					alignItems: "center",
					width: "100%",
					// backgroundColor: "red",
				}}
			>
				<IconButton>
					<StarBorderOutlined />
				</IconButton>
				<IconButton color="error">
					<DeleteOutline />
				</IconButton>
			</Box>
			<Box sx={{ padding: "10px 50px" }}>
				<TextField
					value={title}
					variant="outlined"
					fullWidth
					placeholder="無題"
					onChange={updateTitle}
					sx={{
						".MuiOutlinedInput-input": { padding: 0 },
						".MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						".MuiOutlinedInput-root": {
							fontSize: "2rem",
							fontWeight: 700,
						},
					}}
				></TextField>
				<TextField
					onChange={updateDescription}
					value={description}
					variant="outlined"
					fullWidth
					placeholder="追加"
					sx={{
						".MuiOutlinedInput-input": { padding: 0 },
						".MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						".MuiOutlinedInput-root": {
							fontSize: "1rem",
							fontWeight: 700,
						},
					}}
				/>
			</Box>
		</>
	);
};

export default Memo;
