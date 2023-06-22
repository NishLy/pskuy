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

export default function transactionLanjutan() {
  return (
    <>
      <Stack spacing={2}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></Box>
          <Box sx={{ marginTop: 5 }}>
            <Divider variant="middle"></Divider>
          </Box>
          <Typography></Typography>
        </Container>
      </Stack>
    </>
  );
}
