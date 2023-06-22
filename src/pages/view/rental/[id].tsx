import ImageCoursel from "@/pages/__components/image_coursel";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
import createContext from "@/pages/api/trpc/context";
import trpc from "@/utils/trpc";
import Rental from "@/models/rental";
import Category from "@/pages/__components/category";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: SuperJSON,
  });

  const id = parseInt(context.params?.id as string);
  await helpers.findOneRental.prefetch({ id });

  return {
    props: JSON.parse(JSON.stringify({ id, trpcState: helpers.dehydrate() })),
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [collapse, setCollapse] = React.useState(true);
  const { data } = trpc.findOneRental.useQuery({
    id: parseInt(props.id),
  });

  const dataRental = data?.rental as Rental;

  return (
    <Stack spacing={2} mt={1} sx={{ backgroundColor: "background.paper" }}>
      <Card sx={{ maxWidth: "100%" }}>
        <ImageCoursel
          images={dataRental ? dataRental.rental_images?.split(",") ?? [] : []}
          style={{ aspectRatio: "16/9" }}
        />
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
          subheader="September 14, 2016"
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
                  4.5
                </Typography>
                {" km"}
              </Typography>
            </Box>
            Jarak Rental
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
      <Category />
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
