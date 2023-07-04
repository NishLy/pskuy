import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import getBase64 from "@/lib/getBase64";
import Joystick from "@/models/joystick";
import Console from "@/models/console";
import trpc from "@/utils/trpc";
import { ROOM_DATA } from "@/interfaces/room";
import { useRouter } from "next/dist/client/router";
import Room from "@/models/room";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import SuperJSON from "superjson";
import Rental from "@/models/rental";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "@/pages/(__components)/unauthorized";

/**
 * This function retrieves data for a static page using server-side helpers and returns it as props.
 * @param context - The context parameter is an object that contains information about the current
 * request, such as the request parameters and HTTP headers. In this case, it is specifically a
 * GetStaticPropsContext object, which is used in Next.js to fetch data at build time and pass it as
 * props to a page component. The
 * @returns The `getStaticProps` function is returning an object with a `props` key. The value of the
 * `props` key is an object with two keys: `id` and `trpcState`. The `id` key's value is the `id`
 * parameter from the `context` object. The `trpcState` key's value is the result of calling the
 * `dehydrate
 */
export async function getStaticProps(context: GetStaticPropsContext) {
  if (!useAuth()) return <Unauthorized />;
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      uuid: undefined,
      username: undefined,
      user_type: undefined,
      email: undefined,
      profile_photo: undefined,
      token: undefined,
    },
    transformer: SuperJSON,
  });

  await helpers.showAllConsole.prefetch({});
  await helpers.showAllJoystick.prefetch({});

  const id = context.params?.id as string;

  return {
    props: JSON.parse(
      JSON.stringify({ id_rental: id, trpcState: helpers.dehydrate() })
    ),
  };
}

/**
 * This function retrieves all rental IDs and maps them to paths for use in a Next.js application.
 * @returns This code is returning an object with two properties: `paths` and `fallback`.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const rental = await Rental.findAll({ attributes: ["id"] });
  return {
    paths: rental.map((rental) => ({
      params: {
        id: rental.id.toString(),
      },
    })),
    fallback: "blocking",
  };
};

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  if (!useAuth()) return <Unauthorized />;
  const router = useRouter();

  const { data: dataConsoles } = trpc.showAllConsole.useQuery({});
  const { data: dataJoysticks } = trpc.showAllJoystick.useQuery({});

  const [roomData, setRoomData] = React.useState<ROOM_DATA>({
    console_production_year: 1970,
    id_console: "",
    id_joystick_first_person: null,
    id_joystick_second_person: null,
    id_rental: parseInt(props.id_rental) ?? -1,
    information: "",
    status: "good",
    price_per_hour: -1,
  });

  const [images, setImages] = React.useState<string[]>([]);
  const [upload, setUpload] = React.useState<boolean>(false);
  const imageFileElement = React.useRef<HTMLInputElement>(null);

  /* The above code is using the `useQuery` hook from the `trpc` library in a TypeScript React
application. It is making a query to create a room using the `createRoom` function and passing the
`roomData` as the query parameter. */
  trpc.createRoom.useQuery(roomData, {
    enabled: upload,
    refetchOnMount: true,
    onSuccess(data: { room: Room }) {
      handleFileUpload(data.room?.id as number);
    },
    // onError(error) {
    // },
  });

  /**
   * The function `handleFileUpload` is used to upload image files to a server using a POST request.
   * @param {number} id - The `id` parameter is a number that represents the ID of a room. It is used to
   * associate the uploaded images with a specific room.
   */
  const handleFileUpload = (id: number) => {
    const files = imageFileElement?.current?.files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (files?.length !== 0 && files) {
      const data = new FormData();
      Array.from(files).forEach((e) => {
        data.append(e.name, e);
      });
      data.set("id", id.toString() ?? "");
      fetch("/api/upload/images/room", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          res.ok ? router.push("/manage/rental/" + props.id_rental) : null;
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
    }
  };

  /**
   * The handleSubmit function is used to handle form submission in a TypeScript React component,
   * extracting form data and updating the state with the new data.
   * @param event - The event parameter is of type React.FormEvent<HTMLFormElement>. It represents the
   * form submission event triggered by the user.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataLiteral: ROOM_DATA = {
      ...roomData,
      id_console: data.get("console")?.toString() ?? "",

      console_production_year: parseInt(
        data.get("production")?.toString() ?? "1970"
      ),
      id_joystick_first_person: data.get("joystick1")?.toString() ?? null,
      id_joystick_second_person: data.get("joystick1")?.toString() ?? null,
      information: data.get("information")?.toString() ?? "",
      status: data.get("condition")?.toString() ?? "",
      price_per_hour: parseInt(data.get("price")?.toString() ?? "0"),
    };
    setRoomData(dataLiteral);
    setUpload(true);
  };

  /**
   * The function "handleImageSelected" is used to trigger the file selection dialog when an image is
   * selected.
   */
  const handleImageSelected = async () => {
    imageFileElement.current?.click();
  };
  /**
   * The function `handleImageChange` asynchronously converts selected image files to base64 strings and
   * adds them to an array, which is then set as the state of the component.
   * @returns The function `handleImageChange` does not have a return statement, so it does not
   * explicitly return anything.
   */

  async function handleImageChange() {
    if (!imageFileElement.current) return;
    const fileImages = imageFileElement?.current.files;
    if (!fileImages) return;
    const arr: string[] = [];

    Array.from(fileImages).map(async (e: File) => {
      getBase64(e).then((res) => {
        arr.push(res as string);
        setImages([...arr]);
      });
    });
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography variant="h5" component="h1" mt={2} color="white">
          Input data Ruangan
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ImageCoursel
            controlled={{
              setter: handleImageSelected,
            }}
            images={images}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <input
              hidden
              name="images"
              type="file"
              ref={imageFileElement}
              onChange={handleImageChange}
              multiple
              accept="image/png, image/gif, image/jpeg"
            />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="price"
                  required
                  fullWidth
                  label="Harga rental perjam"
                  autoFocus
                  type="number"
                  placeholder="Eg: Rp. 5.000"
                  inputProps={{ min: 1000 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Jenis konsole
                  </InputLabel>
                  <Select fullWidth label="Tipe console" name="console">
                    {dataConsoles &&
                      (dataConsoles.consoles as Console[]).map((data, i) => (
                        <MenuItem selected={i === 0} key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Controller 1
                  </InputLabel>
                  <Select fullWidth label="Joystick 1" name="joystick1">
                    <MenuItem>Tidak ada</MenuItem>
                    {dataJoysticks &&
                      (dataJoysticks.joysticks as Joystick[]).map((data, i) => (
                        <MenuItem key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Controller 2
                  </InputLabel>
                  <Select fullWidth label="Joystick 1" name="joystick2">
                    <MenuItem>Tidak ada</MenuItem>
                    {dataJoysticks &&
                      (dataJoysticks.joysticks as Joystick[]).map((data, i) => (
                        <MenuItem key={i} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="production"
                  required
                  fullWidth
                  placeholder="2023"
                  type="number"
                  inputProps={{
                    min: 1970,
                    max: 2023,
                    minLength: 4,
                    maxLength: 4,
                  }}
                  label="Tahun Produksi"
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Kondisi</InputLabel>
                  <Select fullWidth label="Joystick 1" name="condition">
                    <MenuItem value="good">Baik</MenuItem>
                    <MenuItem value="useable">Minus</MenuItem>
                    <MenuItem value="unuseable">Rusak</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="information"
                  required
                  fullWidth
                  label="Deskripsi"
                  placeholder="Eg: HDD 1TB FAT, Game terinstal - > GTA V, PES 2023..."
                  autoFocus
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2, mb: 2, paddingY: 2 }}
            >
              Daftarkan Ruangan
            </Button>
          </Box>
        </Box>
      </Container>
      <Stack spacing={2} sx={{ width: "100%" }}></Stack>
    </>
  );
}
