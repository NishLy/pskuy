import {
  Modal,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React from "react";
import { ScriptProps } from "next/script";
import { ROOM_DATA } from "@/interfaces/room";
import trpc from "@/utils/trpc";

interface Props extends ScriptProps {
  data: ROOM_DATA;
  onClose: (trigger: boolean) => void;
  open: boolean;
  refetch: () => void;
}

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

export default function RoomControlModal(props: Props) {
  const [roomStatus, setRoomStatus] = React.useState(props.data.active);
  const [updateStatus, setUpdateStatus] = React.useState(false);

  function handleChangeRoomStatus(evt: React.ChangeEvent<HTMLInputElement>) {
    setRoomStatus(evt.target.checked);
    setUpdateStatus(true);
  }

  const { isSuccess } = trpc.editRoomPublicStatus.useQuery(
    {
      id_room: props.data.id ?? 0,
      active: roomStatus ?? false,
    },
    { enabled: updateStatus }
  );

  React.useEffect(() => {
    setUpdateStatus(false);
    props.refetch();
  }, [isSuccess]);

  return (
    <Modal open={props.open} onClose={() => props.onClose(false)}>
      <Box sx={style}>
        <Typography
          color="info"
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          Kelola Ruangan
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                onChange={handleChangeRoomStatus}
                size="medium"
                checked={roomStatus}
              />
            }
            label="Aktifkan Ruangan"
          />
        </FormGroup>
      </Box>
    </Modal>
  );
}
