import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAppProps {}

export default function ShowOffers(props: IAppProps) {
  return (
    <>
      {/* <Typography variant="h5" mb={2} fontWeight="bold">
        Special Offers
      </Typography> */}
      <Box sx={{ overflowX: "auto", paddingLeft: 1 }}>
        <Grid
          container
          gridAutoFlow="row"
          rowSpacing={1}
          width="max-content"
          columnGap={2}
          paddingRight={2}
        >
          <Grid item>
            <Paper
              elevation={4}
              sx={{ minWidth: "90vw", maxWidth: "90vw", marginBottom: 2 }}
            >
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/images/22.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="body1" component="div">
                      Diskon Top up 50%!
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
