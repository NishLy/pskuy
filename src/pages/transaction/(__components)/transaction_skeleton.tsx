import {
  ListItem,
  Card,
  CardHeader,
  Skeleton,
  CardContent,
  Stack,
} from "@mui/material";
import React from "react";

export const TransactionSkeleton = () => {
  return (
    <ListItem sx={{ padding: 0, marginBottom: 2 }}>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          title={<Skeleton variant="text" />}
          subheader={<Skeleton variant="text" />}
        />

        <CardContent>
          <Stack spacing={2} direction="row" width="100%">
            <Skeleton
              variant="rectangular"
              width={60}
              height={60}
              sx={{ flexShrink: 0 }}
            />
            <Stack width="100%">
              <Skeleton variant="text" height="5ch" />
              <Skeleton variant="text" height="3ch" />
            </Stack>
          </Stack>
        </CardContent>
        <CardContent sx={{ paddingY: 0 }}>
          <Skeleton variant="text" height="3ch" />
          <Skeleton variant="text" height="4ch" />
        </CardContent>
      </Card>
    </ListItem>
  );
};
