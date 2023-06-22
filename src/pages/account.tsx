import { FormatBold, Height, JoinRight, TextFields } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  colors,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { alignProperty } from "@mui/material/styles/cssUtils";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        PsKuiy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function account() {
  return (
    <>
      <Stack spacing={2}>
        <Box padding={4}>
          <Box
            sx={{
              marginTop: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "right",
            }}
          ></Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              marginX: "auto",
            }}
          >
            H
          </Avatar>
          <Box sx={{ marginTop: 5 }}>
            <Divider variant="middle"></Divider>
          </Box>
          <Typography>DummyAKUN</Typography> {/*GET Username Id*/}
          <br></br>
          <Typography sx={{ marginLeft: 2 }}> Data Transaksi :</Typography>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Typography sx={{ marginLeft: 2 }}> Jumlah Transaksi </Typography>
            <Typography sx={{ marginRight: 4 }}>get</Typography>
          </Stack>
          <Typography> Akun4 </Typography>
        </Box>
        <Box sx={{ marginTop: 7 }}></Box>
        <Stack
          direction="row"
          sx={{
            // width: "fit-content",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Typography fontSize={13}>
            Berniat menjadi<br></br> Mitra Usaha?
          </Typography>
          <Link href="/register/owner">
            <Button variant="contained" color="success">
              <Typography fontSize={13}>Daftar Owner</Typography>
            </Button>
          </Link>
        </Stack>
        <Box>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Stack>
    </>
  );
}
