import {
  Button,
  Modal,
  Box,
  IconButton,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import style from "styled-jsx/style";
import { ScriptProps } from "next/script";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props extends ScriptProps {
  onDelete?: () => void;
  open: boolean;
  errorMessage?: string;
  onCancel: (param: boolean) => void;
}

export default function DeleteModal(props: Props) {
  return (
    <Modal
      open={true}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          width: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        height="100vh"
      >
        <Box
          bgcolor="background.paper"
          width="80vw"
          sx={{
            alignItems: "center",
            padding: 2,
            borderRadius: 2,
            justifyContent: "space-around",
          }}
        >
          <Typography variant="h6" color="error" mb={2}>
            {props.errorMessage ? "Hapus Rental Gagal" : "Hapus Rental Ini?"}
          </Typography>
          <Typography
            variant="body1"
            color={props.errorMessage ? "error" : "warning"}
            mb={2}
          >
            {!props.errorMessage
              ? " Peringatan! menghapus rental akan menghapus semua data Ruangan Rental ini!"
              : props.errorMessage}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            {!props.errorMessage && (
              <Button
                variant="contained"
                onClick={() => props.onDelete && props.onDelete()}
              >
                Hapus Rental
              </Button>
            )}
            <Button variant="contained" onClick={() => props.onCancel(false)}>
              Batalkan
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
