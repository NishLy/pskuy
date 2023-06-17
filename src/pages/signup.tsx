import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import client from "@/utils/trpc";
import { USER } from "@/interfaces/user";
import { useRouter } from "next/router";
import Loading from "./__components/loading";
import Copyright from "./__components/copyright";

export default function SignUp() {
  const [userData, setUserData] = React.useState<USER | null>(null);
  const [errors, setErrors] = React.useState<
    | {
        message: string;
        cause: Record<string, string>;
      }
    | undefined
  >(undefined);
  const [isPasswordMatch, setPasswordMatch] = React.useState(true);
  const router = useRouter();

  client.registerAccount.useQuery(
    userData != null
      ? userData
      : { email: "", number: "", password: "", username: "" },
    {
      enabled: !!userData,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
      onSuccess() {
        router.replace("/signin");
      },
      onError(error) {
        console.log(error.data);
        if (error.data?.SQLErrors.uniqueError) {
          setErrors(error.data.SQLErrors.uniqueError);
        }
        setUserData(null);
      },
    }
  );

  console.log(errors);

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
      number: data.get("number")?.toString() ?? "",
      email: data.get("email")?.toString() ?? "",
      username: data.get("username")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
    });
  };

  return (
    <>
      {userData && <Loading />}
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  inputProps={{ minlength: 8, maxlength: 30 }}
                  helperText={
                    errors &&
                    "Username " + errors?.cause?.username + " sudah ada!"
                  }
                  error={!!errors?.cause?.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="number"
                  name="number"
                  required
                  fullWidth
                  id="number"
                  inputProps={{
                    minlength: 11,
                    maxlength: 14,
                    pattern: "[0-9]{11,}",
                  }}
                  label="Nomor Telepon Aktif"
                  title="Nomor Telepon"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={
                    errors && "Email " + errors?.cause?.email + " sudah ada!"
                  }
                  error={!!errors?.cause?.email}
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
                  inputProps={{ minlength: 8, maxlength: 255 }}
                  autoComplete="new-password"
                  // ref={passwordInputElement}
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
                  inputProps={{ minlength: 8, maxlength: 255 }}
                  error={!isPasswordMatch}
                  helperText={!isPasswordMatch && "Password tidak sama!"}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
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
                <Link href="/signin" variant="body2">
                  Sudah punya akun? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </>
  );
}
