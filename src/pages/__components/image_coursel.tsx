import { Box, Button, SxProps } from "@mui/material";
import { ScriptProps } from "next/script";
import React from "react";

type Props = ScriptProps & {
  images: string[];
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  controlled?: { setter: (param: any) => void; setState: (param: any) => void };
};

export default function ImageCoursel(props: Props) {
  const boxElement = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    boxElement.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Box
        id="imageCoursel"
        ref={boxElement}
        sx={
          props.style
            ? {
                width: "100%",
                display: "flex",
                alignItems: "center",
                aspectRatio: "1/1",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                scrollSnapType: "x mandatory",
                ...props.style,
              }
            : {
                borderRadius: 2,
                border: "1px rgba(0, 0, 0, 0.23) solid",
                width: "100%",
                display: "flex",
                alignItems: "center",
                aspectRatio: "1/1",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                scrollSnapType: "x mandatory",
              }
        }
      >
        {props.images.map((src, i) => (
          <Box
            key={i}
            style={{
              position: "relative",
              minWidth: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              scrollSnapAlign: "center",
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
              loading="lazy"
              src={src}
              alt=""
            />
          </Box>
        ))}
        {props.controlled ? (
          <Box
            sx={{
              position: "relative",
              minWidth: "100%",
              aspectRatio: "1/1",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              scrollSnapAlign: "center",
            }}
          >
            <Button
              onClick={() => props.controlled?.setter(boxElement.current)}
              variant="outlined"
            >
              Pilih Gambar
            </Button>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
