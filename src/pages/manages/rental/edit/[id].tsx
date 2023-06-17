import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import client from "@/utils/trpc";
import { useRouter } from "next/router";
import { Alert, Avatar, Snackbar } from "@mui/material";
import getBase64 from "@/lib/getBase64";
import RENTAL_DATA from "@/interfaces/rental";
import cookies from "@/lib/cookies";
import ImageCoursel from "@/pages/__components/image_coursel";
import trpc from "@/utils/trpc";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp() {
  const router = useRouter();
  const [updateData, setUpdateData] = React.useState<
    RENTAL_DATA & { id: number }
  >({
    address: "",
    description: "",
    id_owner: router.query.id_owner as string,
    latitude: 0,
    longitude: 0,
    name: "",
    rental_images: "",
    rental_logo: "",
    id: parseInt((router.query.id as string) ?? "-1"),
  });
  const [images, setImages] = React.useState<string[]>([]);
  const [logoImages, setLogoImages] = React.useState<string | undefined>();
  const [update, setUpadate] = React.useState(false);
  //   const [rentalData,setRentalData] = React.useState<RENTAL_DATA | undefined>()

  const imagesElement = React.useRef<HTMLInputElement>(null);
  const imageLogoElement = React.useRef<HTMLInputElement>(null);

  const { data, error } = client.findOneRental.useQuery({
    id: parseInt((router.query?.id as string) ?? ""),
    id_owner: router.query?.id_owner as string,
  });

  const dataFecthRental = data?.rental as RENTAL_DATA;

  client.editRental.useQuery(updateData, {
    enabled: update,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess(data) {
      setUpadate(false);
      // handleFileUpload(data.id);
    },
    onError() {
      setUpadate(false);
    },
  });

  const handleImagesClick = async () => {
    console.log(imagesElement.current);
    imagesElement.current?.click();
  };
  const handleLogoClick = async () => {
    imageLogoElement.current?.click();
  };

  const handleFileUpload = (id: number) => {
    const files = imagesElement?.current?.files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const logo_file = imageLogoElement.current?.files![0];
    if (files?.length !== 0 && files) {
      console.log(files);
      const data = new FormData();
      Array.from(files).forEach((e) => {
        data.append(e.name, e);
      });
      if (logo_file) data.set("logo_image", logo_file);
      data.set("id", id.toString() ?? "");
      fetch("/api/upload/images/rental", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          console.log(res);
          res.ok ? router.push("/manages/rental") : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setUpdateData({
      ...updateData,
      address: data.get("address")?.toString() ?? "",
      description: data.get("description")?.toString() ?? "",
      // id_owner: cookies.get("uuid") ?? "",
      latitude: parseInt(data.get("latitude")?.toString() ?? "0"),
      longitude: parseInt(data.get("longitude")?.toString() ?? "0"),
      name: data.get("name")?.toString() ?? "",
      rental_images: images
        ? images.toString()
        : (dataFecthRental.rental_images as string),
      rental_logo: logoImages
        ? logoImages
        : (dataFecthRental.rental_logo as string),
    });
    setUpadate(true);
  };

  async function handleImageChange() {
    if (!imagesElement.current) return;
    const fileImages = imagesElement?.current.files;
    if (!fileImages) return;
    const arr: string[] = [];
    Array.from(fileImages).map(async (e: File) => {
      getBase64(e).then((res) => {
        arr.push(res as string);
        setImages([...arr]);
      });
    });
  }

  async function handleLogoChange() {
    if (!imageLogoElement.current) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fileImages = imageLogoElement.current?.files![0];
    if (!fileImages) return;
    setLogoImages((await getBase64(fileImages)) as string);
  }

  function getArrayOfImages(): string[] {
    if (images.length === 0) {
      if (dataFecthRental) {
        setImages(dataFecthRental.rental_images?.split(",") ?? []);
      }
    }
    return images;
  }

  function getLogoImage() {
    if (!logoImages) {
      if (dataFecthRental) return dataFecthRental.rental_logo;
    }
    return logoImages;
  }
  console.log(getLogoImage());

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" mb={4}>
            Edit Detail Rentalmu Disini
          </Typography>
          <Avatar sx={{ height: 80, width: 80 }} src={getLogoImage()}></Avatar>
          <Button onClick={handleLogoClick}>edit logo</Button>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography component="h1" variant="body2" mb={1}>
              Upload foto usaha rentalmu
            </Typography>
            <input
              hidden
              name="images"
              type="file"
              ref={imagesElement}
              onChange={handleImageChange}
              multiple
              accept="image/png, image/gif, image/jpeg"
            />
            <input
              hidden
              name="image_logo"
              type="file"
              ref={imageLogoElement}
              onChange={handleLogoChange}
              accept="image/png, image/gif, image/jpeg"
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ImageCoursel
                  controlled={{
                    setState: setImages,
                    setter: handleImagesClick,
                  }}
                  images={getArrayOfImages()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                  value={dataFecthRental && dataFecthRental.name}
                  id="name"
                  label="Nama Rental"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Deskripsi toko"
                  name="description"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={dataFecthRental && dataFecthRental.description}
                  multiline
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Alamat toko rental"
                  name="address"
                  rows={2}
                  value={dataFecthRental && dataFecthRental.address}
                  multiline
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="latitude"
                  name="latitude"
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="latitude"
                  label="Latitude"
                  value={dataFecthRental && dataFecthRental.latitude}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="longitude"
                  name="longitude"
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={dataFecthRental && dataFecthRental.longitude}
                  id="longitude"
                  label="Longitude"
                  autoFocus
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, paddingY: 2 }}
            >
              Daftarkan
            </Button>
          </Box>
        </Box>
      </Container>
      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error" sx={{ width: "100%" }}>
            {error.data?.code}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
