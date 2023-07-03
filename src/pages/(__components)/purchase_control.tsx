/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, IconButton, Typography, Button, Stack } from "@mui/material";
import React from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

type Props = {
  handler?: (props: any) => void;
  onContinue?: (props: any) => void;
};

export default function PurchaseControl(props: Props) {
  const [value, setValue] = React.useState(1);
  React.useEffect(() => {
    props.handler && props.handler(value);
  }, [value]);

  return (
    <Paper
      sx={{
        width: "100%",
        zIndex: 1500,
        position: "fixed",
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 80,
        paddiing: 10,
      }}
    >
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <IconButton
          onClick={() => setValue((prev) => (prev - 1 === 0 ? prev : prev - 1))}
        >
          <RemoveCircleOutlineOutlinedIcon sx={{ height: 30, widht: 30 }} />
        </IconButton>
        <Typography gutterBottom variant="h5" fontWeight="bold" mb={0} mx={1}>
          {value} H
        </Typography>
        <IconButton onClick={() => setValue((prev) => prev + 1)}>
          <AddCircleOutlinedIcon />
        </IconButton>
      </Stack>
      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={props?.onContinue}
      >
        Pesan Sekarang
      </Button>
    </Paper>
  );
}
