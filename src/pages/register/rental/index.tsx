import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { Avatar, Link } from "@mui/material";
import getBase64 from "@/lib/getBase64";
import RENTAL_DATA from "@/interfaces/rental";
import cookies from "@/lib/cookies";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import MapSelect from "@/pages/(__components)/map_selector";
import trpc from "@/utils/trpc";
import Unauthorized from "@/pages/(__components)/unauthorized";
import useAuth from "@/hooks/useAuth";

export default function SignUp() {
  if (!useAuth()) return <Unauthorized />;
  const [registerData, setRegisterData] = React.useState<RENTAL_DATA>({
    address: "",
    description: "",
    id_owner: "",
    latitude: 0,
    longitude: 0,
    name: "",
  });

  //state
  const [images, setImages] = React.useState<string[]>([]);
  const [logoImages, setLogoImages] = React.useState<string | undefined>();
  const [register, setRegister] = React.useState(false);
  const [openMap, setOpenMap] = React.useState(false);
  const [position, setPosition] = React.useState({ Iat: 0, Ing: 0 });

  //input ref
  const imagesElement = React.useRef<HTMLInputElement>(null);
  const imageLogoElement = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  //api to send data Rental
  trpc.registerRental.useQuery(registerData, {
    enabled: register,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess(data) {
      setRegister(false);
      handleFileUpload(data.id);
    },
    onError() {
      setRegister(false);
    },
  });

  //input element on click handler
  const handleImagesClick = async () => {
    imagesElement.current?.click();
  };

  const handleLogoClick = async () => {
    imageLogoElement.current?.click();
  };

  //function to send images data after the main data Rental is sended
  const handleFileUpload = (id: number) => {
    const files = imagesElement?.current?.files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const logo_file = imageLogoElement.current?.files![0];
    if (files?.length !== 0 && files) {
      console.log(files);
      const data = new FormData();
      Array.from(files).forEach((e) => {
        data.append(e.name, e);
        console.log(e);
      });
      if (logo_file) data.set("logo_image", logo_file);
      data.set("id", id.toString() ?? "");
      fetch("/api/upload/images/rental", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          console.log(res);
          res.ok ? router.push("/manage/rental") : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setRegisterData({
      address: data.get("address")?.toString() ?? "",
      description: data.get("description")?.toString() ?? "",
      id_owner: cookies.get("uuid") ?? "",
      latitude: position.Iat,
      longitude: position.Ing,
      name: data.get("name")?.toString() ?? "",
    });
    setRegister(true);
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
    const fileImages = imageLogoElement.current?.files?.[0];
    if (!fileImages) return;
    setLogoImages((await getBase64(fileImages)) as string);
  }

  function handlePostionChange(IatIng: google.maps.LatLng) {
    setPosition({ Iat: IatIng.lat(), Ing: IatIng.lng() });
    setOpenMap(false);
  }

  return (
    <>
      {openMap && (
        <MapSelect
          moveable={true}
          controlled={{ markerOnChange: handlePostionChange }}
        />
      )}
      <Container sx={{ backgroundColor: "background.paper", py: 2 }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            Daftarkan rentalmu disini
          </Typography>
          <Avatar
            sx={{ height: 80, width: 80 }}
            src={logoImages && logoImages}
          ></Avatar>
          <Button onClick={handleLogoClick}>pilih logo</Button>
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
                    setter: handleImagesClick,
                  }}
                  images={images}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
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
                  rows={4}
                  multiline
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Alamat toko rental"
                  name="address"
                  rows={2}
                  multiline
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12}>
                <Link onClick={() => setOpenMap(true)}>
                  Pilih posisi usaha anda
                </Link>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="latitude"
                  name="latitude"
                  required
                  fullWidth
                  disabled
                  id="latitude"
                  label="Latitude"
                  value={position.Iat}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="longitude"
                  name="longitude"
                  required
                  fullWidth
                  disabled
                  value={position.Ing}
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
    </>
  );
}
