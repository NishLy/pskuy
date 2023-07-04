import ImageCoursel from "@/pages/(__components)/image_coursel";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  IconButtonProps,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import NearMeIcon from "@mui/icons-material/NearMe";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import SuperJSON from "superjson";
import createTRPCContext from "@/pages/api/trpc/context";
import trpc from "@/utils/trpc";
import Rental from "@/models/rental";
import Category from "@/pages/(__components)/category";
import { useRouter } from "next/router";
import getSimplifyNumber from "@/lib/simplifyNumber";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "@/pages/(__components)/unauthorized";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: SuperJSON,
  });

  const id = parseInt(context.params?.id as string);
  if (isNaN(id))
    return {
      redirect: {
        permanent: true,
        destination: "/404",
      },
    };
  await helpers.findOneRental.prefetch({ id });

  return {
    props: JSON.parse(JSON.stringify({ id, trpcState: helpers.dehydrate() })),
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!useAuth()) return <Unauthorized />;

  const router = useRouter();
  const [collapse, setCollapse] = React.useState(true);
  const { data } = trpc.findOneRental.useQuery(
    {
      id: parseInt(props.id),
    },
    {
      onSuccess(data) {
        if (data.rental === null)
          router.replace({
            query: {
              message:
                "Ruangan dengan tidak ditemukan \n Id : " + router.query.id,
            },
            pathname: "/404",
          });
      },
    }
  );

  const dataRental = data?.rental as Rental;

  return (
    <Stack spacing={2} mt={1} sx={{ backgroundColor: "background.paper" }}>
      <Card sx={{ maxWidth: "100%" }}>
        <Container sx={{ backgroundColor: "grey", padding: 0 }}>
          <ImageCoursel
            images={
              dataRental ? dataRental.rental_images?.split(",") ?? [] : []
            }
            style={{ aspectRatio: "16/9" }}
          />
        </Container>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500], width: 60, height: 60 }}
              aria-label="recipe"
              src={dataRental && dataRental.rental_logo}
            >
              PS
            </Avatar>
          }
          title={
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ textTransform: "capitalize" }}
            >
              {dataRental && dataRental.name}
            </Typography>
          }
          subheader={
            <Typography
              variant="body2"
              fontWeight="bold"
              color="text.secondary"
              width="100%"
              noWrap
            >
              {dataRental && dataRental.address}
            </Typography>
          }
        />
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: "auto",
          }}
        >
          <Box
            sx={{
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton sx={{ padding: 0 }}>
                <StarIcon
                  sx={{ width: 30, height: 30, color: "rgb(253, 204, 13)" }}
                />
              </IconButton>
              <Typography variant="h6" color="text.secondary">
                {dataRental && dataRental.total_rating}
              </Typography>
            </Box>
            Ulasan & Rating
          </Box>
          <Divider orientation="vertical" color="black" />
          <Box
            sx={{
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton sx={{ padding: 0 }}>
                <ShoppingCartIcon sx={{ width: 30, height: 30 }} />
              </IconButton>
              <Typography variant="h6" color="text.secondary">
                {dataRental && getSimplifyNumber(dataRental.total_transaction)}
              </Typography>
            </Box>
            Total transaksi
          </Box>
          <Divider orientation="vertical" color="black" />
          <Box
            sx={{
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                sx={{ padding: 0 }}
                onClick={() =>
                  router.push({
                    query: {
                      lat: dataRental?.latitude,
                      lng: dataRental?.longitude,
                    },
                    pathname: "/explore",
                  })
                }
              >
                <NearMeIcon sx={{ width: 30, height: 30 }} />
              </IconButton>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline" }}
              >
                <Typography
                  component="span"
                  variant="h6"
                  color="text.secondary"
                >
                  Lokasi
                </Typography>
              </Typography>
            </Box>
            Buka dimap
          </Box>
        </CardContent>
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            whiteSpace="pre-line"
            noWrap
            sx={{ maxHeight: collapse ? "10ch" : "fit-content" }}
          >
            {dataRental && dataRental.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ padding: 0 }}>
          <ExpandMore expand={!collapse} onClick={() => setCollapse(!collapse)}>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Card>
      <Category id_rental={props.id} />
    </Stack>
  );
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
