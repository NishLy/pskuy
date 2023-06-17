import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import cookieCutter from "@/lib/cookies";
import client from "@/utils/trpc";
import { useRouter } from "next/router";
import AppContext from "@/context/app";
import Loading from "./__components/loading";
import cookies from "@/lib/cookies";
import Copyright from "./__components/copyright";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export interface LOGIN_DATA {
  username: string;
  password: string;
  remember: boolean;
  owner: boolean;
}

export default function SignIn() {
  const [loginData, setloginData] = React.useState<LOGIN_DATA>({
    username: "",
    password: "",
    remember: false,
    owner: false,
  });
  const [fetch, setFetch] = React.useState(false);
  const [errors, setErorrs] = React.useState<{
    [key: string]: any;
  }>({});

  const router = useRouter();
  const [, setUserContext] = React.useContext(AppContext);

  const result = client.login.useQuery(loginData, {
    enabled: fetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,

    onSuccess(data) {
      cookieCutter.set("username", data.username, {
        expires: new Date().toISOString(),
      });
      cookieCutter.set("uuid", data.uuid, {
        expires: new Date().toISOString(),
      });
      cookieCutter.set("user_type", data.user_type, {
        expires: new Date().toISOString(),
      });
      cookieCutter.set("email", data.email, {
        expires: new Date().toISOString(),
      });
      cookieCutter.set("profile_photo", data.profile_photo, {
        expires: new Date().toISOString(),
      });
      cookieCutter.set("token", data.token, {
        expires: new Date().toISOString(),
      });
      setUserContext && setUserContext(data);
      router.push("/home");
    },

    onError(error) {
      console.log(error.data);
      if (!error.data) return;
      setErorrs(error.data);
      setFetch(false);
    },
  });

  React.useEffect(() => {
    if (!cookies.get("uuid") || !cookies.get("token")) null;
    else if (cookies.get("uuid") !== "" && cookies.get("token") !== "")
      router.replace("/home");
  }, [0]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = {
      ...loginData,
      username: data.get("username")?.toString() ?? "",
      password: data.get("password")?.toString() ?? "",
    };
    setFetch(true);
    setloginData(request);
  };

  const handleRememberSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setloginData({
      ...loginData,
      remember: event.currentTarget.checked,
    });
  };
  const handleOwnerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setloginData({
      ...loginData,
      owner: event.currentTarget.checked,
    });
  };

  return (
    <>
      {fetch && <Loading />}
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              error={!!errors.notFound}
              helperText={"notFound" in errors && errors.notFound?.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.unauthorized}
              helperText={
                "unauthorized" in errors && errors.unauthorized?.password
              }
            />
            <Grid container>
              <FormControlLabel
                control={
                  <Checkbox
                    id="remember-login"
                    color="primary"
                    onChange={handleRememberSelect}
                  />
                }
                label="Remember me"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id="owner-login"
                    onChange={handleOwnerSelect}
                    color="primary"
                  />
                }
                label="Login as Owner"
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset/account/password" variant="body2">
                  Lupa password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  Belum punya akun? daftar sekarang
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
