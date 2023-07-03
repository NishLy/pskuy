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
  Skeleton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React, { forwardRef } from "react";
import trpc from "@/utils/trpc";
import Link from "next/link";
import RENTAL_DATA from "@/interfaces/rental";
import NoFoundSpalsh from "./no_found";

type Props = {
  searchQuery: string;
};

export default function RentalCardSearch(props: Props) {
  const [loading, setLoading] = React.useState(true);
  const [rentals, setRentals] = React.useState<RENTAL_DATA[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

  const { data, isFetching, isSuccess } = trpc.showAllRental.useQuery(
    {
      parameters: { name: props.searchQuery },
      offset,
    },
    { enabled: props.searchQuery !== "" }
  );

  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
    data?.rentals &&
      setRentals((prev) => prev.concat(data?.rentals?.rows as RENTAL_DATA[]));
    data?.rentals?.count && setLimitOffset(data.rentals.count);
  }, [isFetching]);

  const lastElement = React.useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0].isIntersecting) {
          limitOffset + 10 >= offset + 10 && setOffset((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <List sx={{ width: "100%", maxWidth: "xs", bgcolor: "background.paper" }}>
      {rentals.length !== 0 ? (
        rentals.map((data, i) => (
          <>
            <RentalCardRef
              data={{ ...data }}
              ref={i + 1 === rentals.length ? lastElement : undefined}
            />
            <Divider variant="inset" component="li" />
          </>
        ))
      ) : (
        <NoFoundSpalsh />
      )}
      {loading && <RentalCardSkeleton />}
    </List>
  );
}

type dataRental = {
  data: RENTAL_DATA;
};

export const RentalCardRef = forwardRef(RentalCard);

export function RentalCard(props: dataRental, ref: any) {
  return (
    <Link
      href={"/view/rental/" + props.data.id}
      style={{ color: "initial", textDecoration: "none" }}
    >
      <ListItem ref={ref} alignItems="center" sx={{ padding: 2 }}>
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

export function RentalCardSkeleton() {
  return (
    <ListItem>
      <Stack spacing={1} direction="row" width="100%" alignItems="center">
        <Skeleton
          variant="circular"
          width={60}
          height={60}
          sx={{ flexShrink: 0 }}
        />
        <Stack width="100%">
          <Skeleton variant="text" width={150} height={30} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      </Stack>
    </ListItem>
  );
}
