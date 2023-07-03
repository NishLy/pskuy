import { TypeTransactionsStatus } from "@/interfaces/status";
import MoreButton from "@/pages/(__components)/more_button";
import { ERROR_IMAGE_PATH } from "@/static/path";
import {
  Modal,
  Box,
  Typography,
  ListItem,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Button,
  MenuItem,
  Alert,
  CardContent,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { CONSOLE_DATA } from "@/interfaces/console";
import RENTAL_DATA from "@/interfaces/rental";
import { ROOM_DATA } from "@/interfaces/room";
import TRANSACTION_DATA from "@/interfaces/transaction";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Link from "next/link";
import trpc from "@/utils/trpc";

type Props = {
  data: TRANSACTION_DATA & {
    Rental: RENTAL_DATA;
    Room: ROOM_DATA & { Console: CONSOLE_DATA };
  };
  refecth: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default React.forwardRef(TransactionUserCard);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TransactionUserCard({ data, refecth }: Props, ref: any) {
  const [openModalCompleted, setOpenModalCompleted] = React.useState(false);
  const [openModalCancel, setOpenModalCancel] = React.useState(false);
  const [transaction, setTransaction] = React.useState<
    "finished" | "cancel" | undefined
  >();

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this case,
it is used to call the `refetch` function whenever the `transaction` state changes. */
  React.useEffect(() => {
    refecth();
  }, [transaction]);

  /* The code `trpc.editUserTransaction.useQuery()` is making a query to edit a user transaction using
 the `trpc` library. */
  trpc.editUserTransaction.useQuery(
    { id: data.id, status: transaction ?? data.status },
    { enabled: !!transaction }
  );

  return (
    <>
      {data.status === "completed" && (
        <Modal
          open={openModalCompleted}
          onClose={() => setOpenModalCompleted(false)}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Selesaikan Transaksi?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
              Pastikan anda Sudah anda menerima apa yang anda pesan
            </Typography>
            <Button
              variant="outlined"
              size="large"
              color="success"
              onClick={() => setTransaction("finished")}
            >
              Selesaikan Transaksi
            </Button>
          </Box>
        </Modal>
      )}

      {data.status === "proccess" && (
        <Modal open={openModalCancel} onClose={() => setOpenModalCancel(false)}>
          <Box sx={style}>
            <Typography
              color="error"
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Batalkan Transaksi?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
              Transaksi dapat dibatalkan hanya ketika status {"'proccess'"}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              color="error"
              onClick={() => setTransaction("cancel")}
            >
              Batalkan Transaksi
            </Button>
          </Box>
        </Modal>
      )}

      <ListItem ref={ref} key={data.id} sx={{ padding: 0, marginBottom: 2 }}>
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
                  <MenuItem>
                    <Link
                      href={{
                        query: {
                          id: data.id,
                          id_rental: data.id_rental,
                          id_room: data.id_room,
                          id_user: data.id_user,
                        },
                        pathname: "/view/transaction/" + data.id,
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      Lihat Detail Transaksi
                    </Link>
                  </MenuItem>
                  {data.status === "completed" && (
                    <MenuItem disableRipple>
                      <Alert
                        severity="success"
                        onClick={() => setOpenModalCompleted(true)}
                      >
                        Selesaikan Transaki
                      </Alert>
                    </MenuItem>
                  )}
                  {data.status === "proccess" && (
                    <MenuItem disableRipple>
                      <Alert
                        onClick={() => setOpenModalCancel(true)}
                        severity="error"
                      >
                        Batalakan Transaki
                      </Alert>
                    </MenuItem>
                  )}
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
          <Link
            href={{
              query: {
                id: data.id,
                id_rental: data.id_rental,
                id_room: data.id_room,
                id_user: data.id_user,
              },
              pathname: "/view/transaction/" + data.id,
            }}
            style={{ textDecoration: "none" }}
          >
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
                    color="text.primary"
                  >
                    {data.Rental.name} - {data.Room.Console.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {data.rent_time} jam
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Link>
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
              {/* {"transakis again"} */}
              {data.status === TypeTransactionsStatus.finished && (
                <Button sx={{ mt: 2 }} variant="outlined" color="success">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    href={"/view/room/" + data.Room.id}
                  >
                    Rental Lagi
                  </Link>
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </ListItem>
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
