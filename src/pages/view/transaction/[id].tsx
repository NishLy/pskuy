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
import { TypeTransactionsStatus } from "@/interfaces/status";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import TransactionDetail from "@/pages/(__components)/transaction_detail";
import TRANSACTION_DATA from "@/interfaces/transaction";
import RENTAL_DATA from "@/interfaces/rental";
import GamepadIcon from "@mui/icons-material/Gamepad";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "@/pages/(__components)/unauthorized";

export default function Page() {
  if (!useAuth()) return <Unauthorized />;
  const router = useRouter();

  const [openTransaction, setOpenTransaction] = React.useState(false);
  const [transaction, setTransaction] = React.useState<
    "finished" | "cancel" | undefined
  >();

  const [sendFeedback, setSendFeedback] = React.useState(false);
  const [feedback, setFeedback] = React.useState({ reating: 5, comment: "" });

  const { data, refetch } = trpc.findOneTransaction.useQuery({
    id: parseInt(router.query.id as string),
    id_rental: parseInt(router.query.id_rental as string),
    id_room: parseInt(router.query.id_room as string),
    id_user: router.query.id_user as string,
  });

  const fetchResult = data?.transaction as TRANSACTION_DATA & {
    Rental: RENTAL_DATA;
  };

  trpc.editUserTransaction.useQuery(
    {
      id: parseInt(router.query.id as string),
      status: transaction ?? fetchResult?.status,
    },
    {
      enabled: !!transaction,
      onSuccess() {
        refetch();
      },
    }
  );

  const { refetch: refecthFeedback } = trpc.editFeedbackTransaction.useQuery(
    {
      id: parseInt(router.query.id as string),
      id_rental: parseInt(router.query.id_rental as string),
      id_room: parseInt(router.query.id_room as string),
      id_user: router.query.id_user as string,
      rating: feedback.reating,
      comment: feedback.comment,
    },
    {
      enabled: !!sendFeedback,
      onSuccess() {
        refecthFeedback();
      },
    }
  );

  const marks = [
    {
      value: 1,
      label: "Tidak",
    },
    {
      value: 2,
      label: "Kurang",
    },
    {
      value: 3,
      label: "Lumayan",
    },
    {
      value: 4,
      label: "Puas",
    },
    {
      value: 5,
      label: "Sangat",
    },
  ];

  return (
    <>
      <TransactionDetail
        data={fetchResult}
        close={setOpenTransaction}
        open={openTransaction}
      />
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
          <Typography component="h1" variant="h5" color="white">
            Transaksi {fetchResult && getStatusText(fetchResult.status)}
          </Typography>
          <Stack spacing={2} width="100%" marginTop={5}>
            <FormControl variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={
                  <InputAdornment position="end">
                    Total Transaksi
                  </InputAdornment>
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
            <Button
              variant="contained"
              sx={{ paddingY: 1 }}
              onClick={() => setOpenTransaction(true)}
            >
              Lihat Invoice
            </Button>
            <Box height={10} />
            {fetchResult && fetchResult.status === "finished" && (
              <>
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
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "Comment",
                    }}
                    fullWidth
                    onChange={(e) =>
                      setFeedback({
                        ...feedback,
                        comment: e.currentTarget.value,
                      })
                    }
                    value={
                      fetchResult?.comment
                        ? fetchResult.comment
                        : feedback.comment
                    }
                    readOnly={fetchResult?.comment !== null}
                    multiline
                    rows={4}
                  />
                </FormControl>
                <Typography variant="body2" mt={2}>
                  Seberapa puas anda dalam transaksi ini?
                </Typography>
                <Box paddingX={2} mb={2}>
                  <Slider
                    defaultValue={fetchResult.rating ? fetchResult.rating : 5}
                    step={1}
                    min={1}
                    disabled={fetchResult.rating ? true : false}
                    max={5}
                    onChange={(_e, val) =>
                      setFeedback({
                        ...feedback,
                        reating: val as number,
                      })
                    }
                    valueLabelDisplay="auto"
                    marks={marks}
                  />
                </Box>
                {fetchResult?.comment === null &&
                  fetchResult.rating === null && (
                    <Button
                      size="large"
                      type="submit"
                      color="success"
                      variant="contained"
                      onClick={() => setSendFeedback(true)}
                    >
                      Kirim Ulasan
                    </Button>
                  )}
              </>
            )}
            <Stack
              paddingTop={5}
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              {fetchResult && fetchResult.status === "proccess" && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ paddingY: 1 }}
                  color="error"
                  onClick={() => setTransaction("cancel")}
                >
                  Batal
                </Button>
              )}
              {fetchResult &&
                (fetchResult.status === "completed" ||
                  fetchResult.status === "ongoing") && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ paddingY: 1 }}
                    color="success"
                    onClick={() => setTransaction("finished")}
                  >
                    Selesai
                  </Button>
                )}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

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
    default:
      return "Error";
  }
}

function getAvatarStatus(status: TypeTransactionsStatus) {
  switch (status) {
    case "proccess":
      return <PendingIcon sx={{ width: 50, height: 50 }} />;
    case "ongoing":
      return <GamepadIcon sx={{ width: 50, height: 50 }} />;
    case "finished":
      return <CheckCircleIcon sx={{ width: 50, height: 50 }} />;
    case "completed":
      return <TimerOffIcon sx={{ width: 50, height: 50 }} />;
    case "cancel":
      return <CancelIcon sx={{ width: 50, height: 50 }} />;
    default:
      return "Error";
  }
}
