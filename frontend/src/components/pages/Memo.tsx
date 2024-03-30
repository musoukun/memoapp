import { Box } from "@mui/system";
import { IconButton, TextField } from "@mui/material";
import { DeleteOutline, StarBorderOutlined } from "@mui/icons-material";
// import { useEffect } from "react";

const Memo = () => {
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
					variant="outlined"
					fullWidth
					placeholder="無題"
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
