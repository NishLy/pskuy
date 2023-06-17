import {
  Paper,
  Button,
  Stack,
  Divider,
  Typography,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React from "react";

type Props = {
  price: {
    dicount: number;
    hour: number;
    total: number;
  };
  onclick_continue: () => void;
  onCancel: () => void;
};

export default function DetailTransaction(props: Props) {
  return (
    <Paper
      sx={{
        width: "100%",
        zIndex: 50,
        position: "fixed",
        bottom: 0,
        left: 0,
        paddingTop: 1,
        borderTop: "0.8px black solid",
      }}
    >
      <Stack spacing={2} padding={2}>
        <Divider />
        <Button
          variant="contained"
          color="error"
          sx={{ position: "absolute", right: 10, top: -60 }}
          onClick={props.onCancel}
        >
          Batalkan
        </Button>
        <Typography variant="body2">Punya Kupon? masukan disini</Typography>
        <FormControl sx={{ m: 1 }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={
              <InputAdornment position="end">Available</InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            fullWidth
          />
        </FormControl>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" color="text.secondary">
            Jam sewa
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {props.price.hour} JAM
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" color="text.secondary">
            Discount :
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Rp {props.price.dicount}
          </Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" color="text.secondary">
            Biaya sewa :
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Rp {props.price.total}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="success"
          size="large"
          sx={{ paddingY: 2 }}
          onClick={props.onclick_continue}
        >
          Lanjutkan
        </Button>
      </Stack>
    </Paper>
  );
}
