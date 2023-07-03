import TRANSACTION_DATA from "@/interfaces/transaction";
import USER_DATA from "@/interfaces/user";
import MoreButton from "@/pages/(__components)/more_button";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItem,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React, { forwardRef } from "react";

type Props = {
  data: TRANSACTION_DATA & { User: USER_DATA };
};

const CommentRef = forwardRef(Comment);

export default CommentRef;

export function Comment(props: Props, ref: any) {
  const rating = React.useMemo(
    () => parseInt(props.data.rating?.toFixed()),
    [props.data]
  );

  return (
    <ListItem ref={ref} sx={{ padding: 0, mb: 2 }}>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          avatar={
            <Avatar src={props.data.User.profile_image}>
              {props.data.User.username}
            </Avatar>
          }
          //   action={
          //     <MoreButton>
          //       <MenuItem></MenuItem>
          //       <MenuItem disableRipple></MenuItem>

          //       <MenuItem disableRipple></MenuItem>
          //     </MoreButton>
          //   }
          title={
            <Typography
              variant="body1"
              fontStyle="larger"
              fontWeight="bold"
              textTransform="capitalize"
            >
              {props.data.User.username}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {new Date(props.data.updatedAt).toLocaleDateString()}
            </Typography>
          }
        />
        <CardContent sx={{ padding: 0, paddingX: 2 }}>
          <Box>
            <IconButton sx={{ padding: 0 }}>
              <StarIcon
                sx={{ color: rating >= 1 ? "rgb(253, 204, 13)" : "none" }}
              />
            </IconButton>
            <IconButton sx={{ padding: 0 }}>
              <StarIcon
                sx={{ color: rating >= 2 ? "rgb(253, 204, 13)" : "none" }}
              />
            </IconButton>
            <IconButton sx={{ padding: 0 }}>
              <StarIcon
                sx={{ color: rating >= 3 ? "rgb(253, 204, 13)" : "none" }}
              />
            </IconButton>
            <IconButton sx={{ padding: 0 }}>
              <StarIcon
                sx={{ color: rating >= 4 ? "rgb(253, 204, 13)" : "none" }}
              />
            </IconButton>
            <IconButton sx={{ padding: 0 }}>
              <StarIcon
                sx={{ color: rating >= 5 ? "rgb(253, 204, 13)" : "none" }}
              />
            </IconButton>
          </Box>
          <Typography mt={1}>{props.data.comment}</Typography>
        </CardContent>
      </Card>
    </ListItem>
  );
}

export function CommentSkeleton() {
  return (
    <ListItem sx={{ padding: 0, mb: 2 }}>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          title={<Skeleton variant="text" />}
          subheader={<Skeleton variant="text" />}
        />
        <CardContent>
          <Skeleton variant="rectangular" height={20} width={120} />
          <Skeleton variant="text" height={80} />
        </CardContent>
      </Card>
    </ListItem>
  );
}
