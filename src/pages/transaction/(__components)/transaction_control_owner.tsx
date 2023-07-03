import { CONSOLE_DATA } from "@/interfaces/console";
import RENTAL_DATA from "@/interfaces/rental";
import { ROOM_DATA } from "@/interfaces/room";
import TRANSACTION_DATA from "@/interfaces/transaction";
import USER_DATA from "@/interfaces/user";
import trpc from "@/utils/trpc";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";

type Props = {
  data: TRANSACTION_DATA & {
    Rental: RENTAL_DATA;
    User: USER_DATA;
    Room: ROOM_DATA & { Console: CONSOLE_DATA };
  };
  time_checkIn: string;
  time_checkOut: string;
  status: "finished" | "proccess" | "ongoing" | "completed" | "cancel";
  refecth: () => void;
  closeModal: (param: boolean) => void;
};

export default function TransactionControl(props: Props) {
  const [acceptTransaction, setAcceptTransaction] = React.useState<
    "ongoing" | "cancel" | undefined
  >(undefined);

/* The code `trpc.editOwnerTransaction.useQuery()` is making a query to edit the owner's transaction.
It takes two arguments: the query parameters and the options. */
  trpc.editOwnerTransaction.useQuery(
    {
      id: props.data.id,
      status: acceptTransaction ? acceptTransaction : "ongoing",
    },
    {
      enabled: !!acceptTransaction,
      onSuccess() {
        props.refecth();
        props.closeModal(false);
      },
    }
  );

  return (
    <Container
      sx={{
        backgroundColor: "white",
        width: "90vw",
        borderRadius: 2,
        padding: 2,
        paddingY: 4,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" mb={2}>
          Detail Rental
        </Typography>
        <TextField
          label="Username Perental"
          InputProps={{
            readOnly: true,
          }}
          value={props.data.User.username}
        />
        <TextField
          label="Rental"
          InputProps={{
            readOnly: true,
          }}
          value={props.data.Rental.name}
        />
        <TextField
          label="Ruangan"
          InputProps={{
            readOnly: true,
          }}
          value="1"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Waktu Checkin"
            defaultValue={dayjs(props.time_checkIn)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Waktu Checkout"
            defaultValue={dayjs(props.time_checkOut)}
          />
        </LocalizationProvider>
        <TextField
          label="Waktu Bermain"
          InputProps={{
            readOnly: true,
          }}
          value={props.data.rent_time + "jam"}
        />
        <TextField
          label="Total"
          InputProps={{
            readOnly: true,
          }}
          value={"Rp " + props.data.total_prices}
        />
        <Stack paddingTop={1} direction="row" justifyContent="space-between">
          {["completed,ongoing,cancel,finsihed"].includes(props.status) && (
            <Button
              variant="contained"
              color="error"
              sx={{ paddingY: 1.5 }}
              onClick={() => setAcceptTransaction("cancel")}
            >
              Tolak Pesanan
            </Button>
          )}
          {props.status === "proccess" && (
            <Button
              variant="contained"
              color="success"
              sx={{ paddingY: 1.5 }}
              onClick={() => setAcceptTransaction("ongoing")}
            >
              Terima Pesanan
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
