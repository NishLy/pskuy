import { Paper, CardActionArea, Grid, Typography, Box } from "@mui/material";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAppProps {}

export default function MainPaperControl(props: IAppProps) {
  return (
    <Paper elevation={8} rounded>
      <CardActionArea>
        <Grid xs={12} container spacing={2} ml={0}>
          <Grid
            item
            xs={12}
            borderBottom={1}
            padding={2}
            boxSizing="border-box"
          >
            <Box paddingTop={2}>
              <Typography gutterBottom variant="overline">
                Sisa waktu rental
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                1 JAM
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} borderRight={1} padding={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2">Start</Typography>
                <Typography variant="body1" fontWeight="bold">
                  19:00
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4">-</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  End
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  23:30
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} padding={2}>
            <Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  class
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Economy Class
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} borderTop={1} padding={2}>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
    </Paper>
  );
}
