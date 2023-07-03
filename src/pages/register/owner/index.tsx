import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
import Copyright from "@/pages/(__components)/copyright";
import Loading from "@/pages/(__components)/loading";
import UserContext from "@/context/app";

// TODO remove, this demo shouldn't need to reset the theme.

export default function RegisterOwner() {
  const [userContext] = React.useContext(UserContext);
  const [ownerData, setUserData] = React.useState<OWNER>({
    id_user: userContext?.uuid ?? "",
    name: "",
    email: "",
    password: "",
    nik: "",
    username: "",
    number: "",
    birth_date: "",
  });
  const [signup, setSignup] = React.useState(false);
  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  const [isPasswordMatch, setPasswordMatch] = React.useState(true);

  const router = useRouter();

  const { error } = client.registerOwner.useQuery(ownerData, {
    enabled: signup,
    onSuccess() {
      cookies.destroy();
      router.push("/signin");
    },
    onError() {
      setSignup(false);
    },
  });

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
    setSignup(true);
  };

  return (
    <>
      {signup && <Loading />}
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
            Daftar Akun Usaha
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
                  label="Nomor Aktif"
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
              sx={{ mt: 3, mb: 2, paddingY: 2 }}
            >
              Daftar akun usaha
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignIn" variant="body2">
                  Dengan mendaftarkan akun usaha anda sudah menyetujui syarat
                  dan perturan kami
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={!!error?.data?.SQLErrors.uniqueError?.cause?.id_user}
          autoHideDuration={6000}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            Satu akun hanya bisa memiliki 1 akun Usaha
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}
