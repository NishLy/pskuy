import { Copyright } from "@mui/icons-material";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { errors } from "formidable";
import Link from "next/link";
import React from "react";
export default function Page() {
  return (
    <Container component="main" maxWidth="xs">
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
          Transaksi Berhasil
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
  );
}
