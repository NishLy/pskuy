import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import client from "@/utils/trpc";
import { useRouter } from "next/router";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { OWNER } from "@/interfaces/owner";
import dayjs, { Dayjs } from "dayjs";
import Alert from "@mui/material/Alert";
import { Snackbar, Stack } from "@mui/material";
import handleFieldError from "@/utils/handle_field_errors";
import cookies from "@/lib/cookies";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp() {
  const [ownerData, setUserData] = React.useState<OWNER>({
    id_user: "fed6ea9f-8629-4c6b-b562-3c63f09849b6",
    name: "",
    email: "",
    password: "",
    nik: "",
    username: "",
    number: "",
    birth_date: "",
  });
  // const [error, setErrors] = React.useState({});
  const [SignUp, setSignUp] = React.useState(false);
  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  const [isPasswordMatch, setPasswordMatch] = React.useState(true);
  const router = useRouter();
  // const passwordInputElement = useRef<HTMLInputElement>(null);

  // console.log(ctx.);
  const result = client.registerOwner.useQuery(ownerData, {
    enabled: SignUp,
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
    refetchOnReconnect: false,
    // retry: false,
    staleTime: Infinity,
    onSuccess() {
      // closeBackdrop();
      router.push("/signin");
    },
    onError() {
      // closeBackdrop();
    },
  });

  result.data;

  const { error } = result;
  console.log(result);

  function checkPassword(event: React.ChangeEvent<HTMLInputElement>) {
    if (
      event.currentTarget.value ===
      (document.querySelector("#password") as HTMLInputElement)?.value
    )
      return setPasswordMatch(true);
    return setPasswordMatch(false);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setUserData({
      id_user: cookies.get("uuid") ?? "",
      name: data.get("name")?.toString() ?? "",
      nik: data.get("nik")?.toString() ?? "",
      birth_date: date?.toISOString() ?? new Date().toISOString(),
      number: data.get("number")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      username: data.get("username")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
    });
    setSignUp(true);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nama Lengkap"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  helperText={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.username,
                  ])}
                  error={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.username,
                  ])}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nik"
                  label="Nomor Induk Kependendudukan"
                  name="nik"
                  autoComplete="nik"
                  helperText={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.nik,
                    error?.data?.zodErrors?.fieldErrors.nik,
                  ])}
                  error={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.nik,
                    error?.data?.zodErrors?.fieldErrors.nik,
                  ])}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="number"
                  name="number"
                  required
                  fullWidth
                  id="number"
                  label="Active Number"
                  autoFocus
                  helperText={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.number,
                    error?.data?.zodErrors?.fieldErrors.number,
                  ])}
                  error={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.number,
                    error?.data?.zodErrors?.fieldErrors.number,
                  ])}
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Tanggal Lahir"
                    onChange={(newValue: dayjs.Dayjs | null) =>
                      newValue ? setDate(newValue) : null
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.email,
                  ])}
                  error={handleFieldError([
                    error?.data?.SQLErrors?.uniqueError?.cause.email,
                  ])}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText={handleFieldError([
                    error?.data?.zodErrors?.fieldErrors.password,
                  ])}
                  error={handleFieldError([
                    error?.data?.zodErrors?.fieldErrors.password,
                  ])}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repassword"
                  label="Retype Password"
                  type="password"
                  id="repassword"
                  autoComplete="new-password"
                  onChange={checkPassword}
                  error={!isPasswordMatch}
                  helperText={!isPasswordMatch && "Password tidak sama!"}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={!!error?.data?.SQLErrors.uniqueError?.cause?.id_user}
          autoHideDuration={6000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {/* {error?.data?.SQLErrors.uniqueError?.cause?.id_user} */}
            Satu akun hanya bisa memiliki 1 akun owner
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}
