/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { ScriptProps } from "next/script";
import React from "react";

type Props = ScriptProps & {
  images: string[];
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  img_styles?: React.CSSProperties;
  controlled?: {
    setter: (param: any) => void;
    onImageDelete?: (param: any, index?: number) => void;
  };
};

export default function ImageCoursel(props: Props) {
  const boxElement = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    boxElement.current?.scrollBy({ left: -140, behavior: "smooth" });
  }, [props.images]);

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
                ...props.img_styles,
              }}
              loading="lazy"
              src={src ? src : "/images/Error/404_NOT_FOUND.avif"}
              width={800}
              height={800}
              placeholder="blur"
              // blurDataURL="/images/blur.webp"
              alt=""
            />
            {props.controlled?.onImageDelete && (
              <Button
                sx={{ position: "absolute", bottom: 10, right: 10 }}
                variant="contained"
                color="error"
                onClick={() =>
                  props.controlled?.onImageDelete &&
                  props.controlled?.onImageDelete(src, i)
                }
              >
                Hapus
              </Button>
            )}
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
