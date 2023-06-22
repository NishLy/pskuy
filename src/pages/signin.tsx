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
import cookies from "@/lib/cookies";
import trpc from "@/utils/trpc";
import { useRouter } from "next/router";
import AppContext from "@/context/app";
import Loading from "./__components/loading";
import Copyright from "./__components/copyright";

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

  const [userContext, setUserContext] = React.useContext(AppContext);

  const router = useRouter();
  /* `trpc.login.useQuery` is a hook provided by the `trpc` library that allows us to make a query to
 the server to log in a user. It takes in the `loginData` object as a parameter, which contains the
 username, password, and remember/owner boolean values. */
  trpc.login.useQuery(loginData, {
    enabled: fetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,

    onSuccess(data) {
      cookies.set("username", data.username, {
        expires: new Date().toISOString(),
      });
      cookies.set("uuid", data.uuid, {
        expires: new Date().toISOString(),
      });
      cookies.set("user_type", data.user_type, {
        expires: new Date().toISOString(),
      });
      cookies.set("email", data.email, {
        expires: new Date().toISOString(),
      });
      cookies.set("profile_photo", data.profile_photo, {
        expires: new Date().toISOString(),
      });
      cookies.set("token", data.token, {
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

  /* This `React.useEffect` hook is checking if the user is already logged in by checking if the
  `userContext` has a `token` and `uuid` value. If both values are present, it redirects the user to
  the home page using `router.replace("/home")`. The dependency array `[0]` ensures that this effect
  runs only once when the component mounts. */
  React.useEffect(() => {
    if (!userContext?.token || !userContext?.uuid) null;
    else if (userContext?.token !== "" && userContext?.uuid !== "")
      router.replace("/home");
  }, [0]);

  /**
   * This function handles form submission by getting form data, updating login data, and setting a fetch
   * flag.
   * @param event - The event parameter is of type React.FormEvent<HTMLFormElement>, which is a synthetic
   * event that is triggered when a form is submitted. It contains information about the form submission,
   * such as the target form element and the data submitted in the form.
   */
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

  /**
   * These are two event handlers in a TypeScript React component that update the state of a login form
   * based on checkbox inputs.
   * @param event - React.ChangeEvent<HTMLInputElement> is a type definition for an event object that is
   * triggered when the value of an HTML input element changes. It is a generic type that takes an
   * HTMLInputElement as a type parameter. The event object contains information about the input element
   * that triggered the event, such as its current value
   */
  const handleRememberSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setloginData({
      ...loginData,
      remember: event.currentTarget.checked,
    });
  };

  /**
   * This function updates the `owner` property in the `loginData` object based on the checked state of
   * an input element.
   * @param event - React.ChangeEvent<HTMLInputElement> - This is a type definition for the event
   * object that is passed as an argument to the handleOwnerSelect function. It is a specific type of
   * event object that is triggered when the value of an input element of type "checkbox" is changed.
   * It contains information about the event
   */
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
              /* This code is setting the error state and helper text of the username input field based
             on whether the `errors` object contains a `notFound` property. */
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
              /* This code is setting the error state of the password input field based on whether the
            `errors` object contains an `unauthorized` property. */
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
