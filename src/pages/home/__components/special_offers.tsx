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
import Image from "next/image";
import * as React from "react";

export default function ShowOffers() {
  return (
    <>
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
              sx={{
                minWidth: "90vw",
                maxWidth: "90vw",
                marginBottom: 2,
                aspectRatio: "16/9",
              }}
            >
              <Card>
                <CardActionArea>
                  <Image
                    height="150"
                    width="360"
                    src="/images/22.jpg"
                    alt="green iguana"
                    style={{ aspectRatio: "16/9", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="body1" component="div">
                      Diskon Top up 50%!
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Paper>
          </Grid>{" "}
        </Grid>
      </Box>
    </>
  );
}
