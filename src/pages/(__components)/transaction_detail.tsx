import RENTAL_DATA from "@/interfaces/rental";
import TRANSACTION_DATA from "@/interfaces/transaction";
import { Divider, Modal, Stack, Typography } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type Props = {
  data: (TRANSACTION_DATA & { Rental: RENTAL_DATA }) | undefined;
  open: boolean;
  close: (param: boolean) => void;
};

export default function TransactionDetail(props: Props) {
  return (
    <Modal open={props.open} onClose={() => props.close(false)}>
      <Stack spacing={2} sx={style}>
        <Typography variant="h6" mb={2}>
          Detail Transaksi
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            STATUS
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            textTransform="uppercase"
            color={props.data?.status === "cancel" ? "error" : "text.primary"}
          >
            {props.data?.status}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            TANGGAL
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {new Date(props.data?.createdAt ?? "").toLocaleDateString()}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            RENTAL
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            textTransform="capitalize"
          >
            {props.data?.Rental.name}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            WAKTU RENTAL
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {props.data?.rent_time} Jam
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            WAKTU CHECKIN
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {new Date(props.data?.time_checkIn ?? "")
              .toLocaleTimeString()
              .slice(0, -3)}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            WAKTU CHECOUT
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {new Date(props.data?.time_checkOut ?? "")
              .toLocaleTimeString()
              .slice(0, -3)}
          </Typography>
        </Stack>
        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            TARIF RENTAL
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {/* // eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {props.data && props.data?.total_prices / props.data?.rent_time}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="text.primary">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="green">
            {props.data?.total_prices}
          </Typography>
        </Stack>
      </Stack>
    </Modal>
  );
}
