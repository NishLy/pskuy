import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  FormControl,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  Slider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";
import trpc from "@/utils/trpc";
import { useRouter } from "next/router";
import Transaction from "@/models/transaction";
import { TypeTransactionsStatus } from "@/interfaces/status";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";

export default function Page() {
  const router = useRouter();
  const [dataTransaction, setDataTransaction] = React.useState({
    id: -1,
    id_user: "",
    id_rental: -1,
    id_room: -1,
  });

  const { data, error } = trpc.findOneTransaction.useQuery(dataTransaction);
  const fetchResult = data?.transaction as Transaction;

  console.log(data, error);

  React.useEffect(() => {
    const query = router.query;
    if (query.id && query.id_rental && query.id_room && query.id_user)
      setDataTransaction({
        id: parseInt(query.id as string),
        id_rental: parseInt(query.id_rental as string),
        id_room: parseInt(query.id_room as string),
        id_user: query.id_user as string,
      });
  }, []);

  const marks = [
    {
      value: 1,
      label: "Tidak",
    },
    {
      value: 25,
      label: "Kurang",
    },
    {
      value: 50,
      label: "Lumayan",
    },
    {
      value: 75,
      label: "Puas",
    },
    {
      value: 100,
      label: "Sangat",
    },
  ];

  function getStatusText(status: TypeTransactionsStatus) {
    switch (status) {
      case "proccess":
        return "Diproses";
      case "ongoing":
        return "Berjalan";
      case "finished":
        return "Selesai";
      case "completed":
        return "Ditaguhkan";
      case "cancel":
        return "Dibatalkan";
    }
  }

  function getAvatarStatus(status: TypeTransactionsStatus) {
    switch (status) {
      case "proccess":
        return "Diproses";
      case "ongoing":
        return <PendingIcon sx={{ width: 40, height: 40 }} />;
      case "finished":
        return <CheckCircleIcon sx={{ width: 40, height: 40 }} />;
      case "completed":
        return <ErrorIcon sx={{ width: 40, height: 40 }} />;
      case "cancel":
        return <CancelIcon sx={{ width: 40, height: 40 }} />;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: "secondary.main",
            width: 50,
            height: 50,
            padding: 0,
          }}
        >
          {fetchResult && getAvatarStatus(fetchResult.status)}
        </Avatar>
        <Typography component="h1" variant="h5">
          Transaksi {fetchResult && getStatusText(fetchResult.status)}
        </Typography>
        <Stack spacing={2} width="100%" marginTop={5}>
          <FormControl variant="outlined">
            <OutlinedInput
              id="outlined-adornment-weight"
              endAdornment={
                <InputAdornment position="end">Lihat detail</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              fullWidth
              sx={{ fontWeight: "bold", fontSize: "larger", color: "blue" }}
              disabled
              color="info"
              value={fetchResult && `Rp  ${fetchResult.total_prices}`}
            />
          </FormControl>
          <Typography variant="body2">
            Kamu dapat melihat detail Transaksi disini
          </Typography>
          <Button variant="contained" sx={{ paddingY: 1 }}>
            Lihat Invoice
          </Button>
          <Box height={10} />
          <FormControl variant="outlined">
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                backgroundColor: "background.paper",
                color: "text.secondary",
              }}
            >
              Berikan komentarmu
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-weight"
              endAdornment={
                fetchResult &&
                fetchResult.comment === null && <Button>Kirim</Button>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "Comment",
              }}
              fullWidth
              multiline
              rows={4}
            />
          </FormControl>
          {fetchResult && fetchResult.status === "finished" && (
            <>
              <Typography variant="body2">
                Seberapa puas anda dalam transaksi ini?
              </Typography>
              <Box paddingX={2}>
                <Slider
                  defaultValue={100}
                  step={25}
                  valueLabelDisplay="auto"
                  marks={marks}
                />
              </Box>
            </>
          )}
          <Stack
            paddingTop={5}
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            {fetchResult && fetchResult.status !== "finished" && (
              <Button
                fullWidth
                variant="contained"
                sx={{ paddingY: 1 }}
                color="error"
              >
                Batal
              </Button>
            )}
            {fetchResult &&
              (fetchResult.status === "completed",
              fetchResult.status === "ongoing") && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ paddingY: 1 }}
                  color="success"
                >
                  Selesai
                </Button>
              )}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
