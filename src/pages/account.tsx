import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import Copyright from "./(__components)/copyright";

import trpc from "@/utils/trpc";
import UserContext from "@/context/app";
import cookies from "@/lib/cookies";
import USER_DATA from "@/interfaces/user";

export default function account() {
  const [userContext] = React.useContext(UserContext);

  const { data } = trpc.getAccountDetails.useQuery({
    id: userContext?.uuid ?? cookies.get("uuid") ?? "",
    isUser: userContext?.user_type === "user" ? true : false,
  });

  const userData = {
    data: data?.user as USER_DATA,
    transactions: data?.transactions as { total: number },
  };

  return (
    <>
      <Stack spacing={2}>
        <Box padding={4}>
          <Box
            sx={{
              marginTop: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "right",
            }}
          ></Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              marginX: "auto",
            }}
            src={userData?.data?.profile_image}
          >
            {userData?.data?.username}
          </Avatar>
          <Box sx={{ marginTop: 5 }}>
            <Divider variant="middle"></Divider>
          </Box>
          <Typography>Info Akun</Typography> {/*GET Username Id*/}
          <br></br>
          <Typography sx={{ marginLeft: 2 }}> Data Transaksi :</Typography>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Typography sx={{ marginLeft: 2 }}>
              Jumlah Transaksi : {userData?.transactions?.total}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ marginTop: 7 }}></Box>
        <Stack
          direction="row"
          sx={{
            // width: "fit-content",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {userContext?.user_type === "user" && (
            <>
              <Typography fontSize={13}>
                Berniat menjadi<br></br> Mitra Usaha?
              </Typography>
              <Link href="/register/owner">
                <Button variant="contained" color="success">
                  <Typography fontSize={13}>Daftar Owner</Typography>
                </Button>
              </Link>
            </>
          )}
        </Stack>
        <Box>
          <Copyright />
        </Box>
      </Stack>
    </>
  );
}
