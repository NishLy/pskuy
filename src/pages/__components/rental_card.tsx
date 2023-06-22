import {
  Avatar,
  List,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
import trpc from "@/utils/trpc";
import Link from "next/link";
import RENTAL_DATA from "@/interfaces/rental";

type Props = {
  searchQuery: string;
};

export default function RentalCardSearch(props: Props) {
  const { data, isLoading, error } = trpc.showAllRental.useQuery(
    {
      name: props.searchQuery,
    },
    { enabled: props.searchQuery !== "" }
  );

  return (
    <List sx={{ width: "100%", maxWidth: "xs", bgcolor: "background.paper" }}>
      {data && data.rentals?.length !== 0
        ? (data.rentals as RENTAL_DATA[])?.map((data) => (
            <>
              <RentalCard data={{ ...data }} />
              <Divider variant="inset" component="li" />
            </>
          ))
        : "nothing"}
    </List>
  );
}

type dataRental = {
  data: RENTAL_DATA;
};

export function RentalCard(props: dataRental) {
  return (
    <Link
      href={"/view/rental/" + props.data.id}
      style={{ color: "initial", textDecoration: "none" }}
    >
      <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
        <ListItemAvatar>
          <Avatar
            sx={{
              height: 60,
              width: 60,
              marginRight: 2,
            }}
            alt="Remy Sharp"
            src={props.data.rental_logo ?? ""}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
            >
              <Typography fontWeight="500" noWrap>
                {props.data.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-arrounf",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {props.data.total_rating}
                </Typography>
                <IconButton>
                  <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
                </IconButton>
              </Box>
            </Stack>
          }
          secondary={
            <Typography
              variant="body2"
              noWrap
              whiteSpace="pre-line"
              sx={{ maxHeight: "8ch" }}
            >
              <Typography
                noWrap
                variant="body2"
                color="text.primary"
                fontWeight="bold"
              >
                {props.data.address}
              </Typography>
              {props.data.description}
            </Typography>
          }
        />
      </ListItem>
    </Link>
  );
}
