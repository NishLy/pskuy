import { Button, Modal, Box, IconButton } from "@mui/material";
import React from "react";
import style from "styled-jsx/style";
import { ScriptProps } from "next/script";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props extends ScriptProps {
  onDelete?: () => void;
}

export default function DeleteModal(props: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box onClick={handleOpen}>
        <DeleteIcon sx={{ marginRight: 2 }} />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Text in a modal</h2>
          <p id="parent-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <Button onClick={() => props.onDelete && props.onDelete()}>
            Delete Rental
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}
