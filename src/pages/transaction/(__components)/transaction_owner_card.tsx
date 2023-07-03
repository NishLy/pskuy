import { CONSOLE_DATA } from "@/interfaces/console";
import RENTAL_DATA from "@/interfaces/rental";
import { ROOM_DATA } from "@/interfaces/room";
import { TypeTransactionsStatus } from "@/interfaces/status";
import TRANSACTION_DATA from "@/interfaces/transaction";
import MoreButton from "@/pages/(__components)/more_button";
import { ERROR_IMAGE_PATH } from "@/static/path";
import {
  ListItem,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Button,
  MenuItem,
  Typography,
  CardContent,
  Box,
  Modal,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Image from "next/image";
import React = require("react");
import TransactionControl from "./transaction_control_owner";
import USER_DATA from "@/interfaces/user";

type Props = {
  data: TRANSACTION_DATA & {
    Rental: RENTAL_DATA;
    User: USER_DATA;
    Room: ROOM_DATA & { Console: CONSOLE_DATA };
  };
  refecth: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TransactionOwnerCard({ data, refecth }: Props, ref: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TransactionControl
          data={data}
          refecth={refecth}
          time_checkIn={data.time_checkIn.toString()}
          time_checkOut={data.time_checkOut.toString()}
          status={data.status}
          closeModal={setOpen}
        />
      </Modal>
      <ListItem key={data.id} sx={{ padding: 0, mb: 2 }} ref={ref}>
        <Card sx={{ width: "100%" }}>
          <CardHeader
            avatar={
              <IconButton>
                <SportsEsportsIcon />
              </IconButton>
            }
            action={
              <Stack direction="row" alignItems="center">
                <Button
                  variant="contained"
                  size="small"
                  color={getStatusButtonColor(data.status)}
                >
                  {getStatusText(data.status)}
                </Button>
                <MoreButton>
                  <MenuItem disableRipple onClick={handleOpen}>
                    Kelola Transaksi
                  </MenuItem>
                </MoreButton>
              </Stack>
            }
            title={
              <Typography variant="body1" fontWeight="bold">
                Rental
              </Typography>
            }
            subheader={new Date(data.createdAt).toDateString()}
          />
          <CardContent>
            <Stack direction="row" alignItems="center">
              <Image
                src={data.Room.room_images?.split(",")[0] ?? ERROR_IMAGE_PATH}
                width={50}
                height={50}
                alt="toko"
                style={{ objectFit: "cover", borderRadius: 5 }}
              />
              <Box ml={2}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {data.Rental.name} - {data.Room.Console.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {data.rent_time} jam
                </Typography>
              </Box>
            </Stack>
          </CardContent>
          <CardContent sx={{ paddingY: 0 }}>
            <Stack>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Total Transaksi
                </Typography>
                <Typography variant="body1" fontWeight="bold" fontSize="larger">
                  Rp {data.total_prices}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </ListItem>
    </>
  );
}

const TransactionOwnerCardRef = React.forwardRef(TransactionOwnerCard);
export default TransactionOwnerCardRef;

function getStatusText(status: TypeTransactionsStatus) {
  switch (status) {
    case "proccess":
      return "Diproses";
    case "ongoing":
      return "Berjalan";
    case "finished":
      return "Selesai";
    case "completed":
      return "Berhasil";
    case "cancel":
      return "Dibatalkan";
    default:
      return "Error";
  }
}

function getStatusButtonColor(status: TypeTransactionsStatus) {
  switch (status) {
    case "proccess":
      return "warning";
    case "ongoing":
      return "info";
    case "finished":
      return "success";
    case "completed":
      return "success";
    case "cancel":
      return "error";
    default:
      return "error";
  }
}
