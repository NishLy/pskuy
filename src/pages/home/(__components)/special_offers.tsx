import OFFER_DATA from "@/interfaces/offer";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { ERROR_IMAGE_PATH } from "@/static/path";
import trpc from "@/utils/trpc";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Image from "next/image";
import React from "react";
import SuperJSON from "superjson";

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      uuid: undefined,
      username: undefined,
      user_type: undefined,
      email: undefined,
      profile_photo: undefined,
      token: undefined,
    },
    transformer: SuperJSON,
  });

  await helpers.showAllOffers.prefetch();

  return {
    props: JSON.parse(
      JSON.stringify({
        trpcState: helpers.dehydrate(),
      })
    ),
  };
}

export default function ShowOffers() {
  const { data } = trpc.showAllOffers.useQuery();
  const offersData = data?.offers as OFFER_DATA[];
  return (
    <>
      <Box sx={{ overflowX: "auto", paddingLeft: 1, pb: 1.5 }}>
        <Stack direction="row" width="100%">
          {offersData &&
            offersData.length !== 0 &&
            offersData.map((data) => (
              <Paper
                key={data.id}
                elevation={4}
                sx={{
                  minWidth: "92%",
                  pr: 1.5,
                }}
              >
                <Card>
                  <CardActionArea>
                    <Image
                      height="150"
                      width="360"
                      src={data.offer_image ?? ERROR_IMAGE_PATH}
                      alt="green iguana"
                      style={{
                        aspectRatio: "21/9",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <CardContent sx={{ padding: 1, paddingX: 2 }}>
                      <Typography gutterBottom variant="body1" component="div">
                        {data.caption}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Paper>
            ))}
        </Stack>
      </Box>
    </>
  );
}
