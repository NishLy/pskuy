import {
  Paper,
  Button,
  Stack,
  Divider,
  Typography,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

type Props = {
  price: {
    dicount: number;
    hour: number;
    total: number;
  };
  onclick_continue: () => void;
  onCancel: () => void;
  onTimeChange: ({
    checkIn,
    checkOut,
  }: {
    checkIn: string;
    checkOut: string;
  }) => void;
};

export default function DetailTransaction(props: Props) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  React.useEffect(() => {
    props.onTimeChange({
      checkIn: value?.toISOString() ?? new Date().toISOString(),
      checkOut:
        value?.add(props.price.hour, "hours").toISOString() ??
        new Date().toISOString(),
    });
  }, [value]);

  return (
    <Paper
      sx={{
        width: "100%",
        zIndex: 50,
        position: "fixed",
        bottom: 0,
        height: "fit-content",
        left: 0,
        paddingTop: 1,
      }}
    >
      <Stack spacing={2} padding={2}>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Jam Checkin"
            value={value}
            disablePast
            onChange={(newValue) => setValue(newValue)}
          />
          <TimePicker
            label="Jam Checkout"
            readOnly
            disablePast
            value={value?.add(props.price.hour, "hours")}
          />
        </LocalizationProvider>
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
