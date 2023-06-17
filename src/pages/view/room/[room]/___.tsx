// import {
//   AvatarGroup,
//   Box,
//   Button,
//   Container,
//   Divider,
//   IconButton,
//   Stack,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import StarIcon from "@mui/icons-material/Star";
// import { FavoriteBorder } from "@mui/icons-material";
// import trpc from "@/utils/trpc";
// import { useRouter } from "next/dist/client/router";
// import ImageCoursel from "@/pages/__components/image_coursel";
// import PurchaseControl from "@/pages/__components/purchase_control";
// import { ROOM_DATA } from "@/interfaces/room";
// import { CONSOLE_DATA } from "@/interfaces/console";
// import RENTAL_DATA from "@/interfaces/rental";
// import getSimplifyNumber from "@/lib/simplifyNumber";
// import Loading from "@/pages/__components/loading";

// // export async function getStaticProps(
// //   context: GetStaticPropsContext<{ id: string }>
// // ) {
// //   // if (!(await verifyToken(ctx.req.cookies.token))) return redirectLogin();

// //   const helpers = createServerSideHelpers({
// //     router: appRouter,
// //     ctx: {
// //       uuid: undefined,
// //       username: undefined,
// //       user_type: undefined,
// //       email: undefined,
// //       profile_photo: undefined,
// //       token: undefined,
// //     },
// //     transformer: superjson, // optional - adds superjson serialization
// //   });

// //   // if (!ctx.req.cookies.token) return redirectLogin();
// //   // if (!(await findOwnerRecord(ctx.req.cookies.uuid ?? "")))
// //   // return redirectLogin();

// //   // const id = context.params.
// //   // await helpers.getOwner.prefetch({
// //   //   id: ctx.req.cookies.uuid ?? "",
// //   // });

// //   await helpers.findRoomById.prefetch({id});
// //   // await helpers.showAllJoystick.prefetch({});

// //   // const consoles = await showAllConsole({}).catch((err) => redirectLogin());
// //   // const joysticks = await showJoystick({}).catch((err) => redirectLogin());
// //   // console.log(consoles, "console");
// //   return {
// //     props: JSON.parse(
// //       JSON.stringify({
// //         // uuid: ctx.req.cookies.uuid,
// //         // consoles,
// //         // joysticks,
// //         trpcState: helpers.dehydrate(),
// //       })
// //     ),
// //   };

// export default function index() {
//   const router = useRouter();
//   const [mounted, setMounted] = React.useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   const { data, error } = trpc.findAllRoomAssoc.useQuery(
//     {
//       id: router.query.room
//         ? parseInt((router.query.room as string) ?? "0")
//         : undefined,
//     },
//     {
//       enabled: true,
//       refetchOnReconnect: false,
//       refetchOnMount: false,
//       staleTime: 120 * 1000,
//     }
//   );

//   const dataRoom = data?.rooms[0] as ROOM_DATA & {
//     Console: CONSOLE_DATA;
//     Rental: RENTAL_DATA;
//   };

//   return (
//     <>
//       {mounted ? (
//         <Container
//           sx={{
//             padding: 0,
//             scrollSnapType: "y mandatory",
//             maxHeight: "100vh",
//             position: "fixed",
//             top: 60,
//             left: 0,
//             zIndex: 0,
//             overflowY: "auto",
//           }}
//         >
//           <ImageCoursel
//             images={[(data && dataRoom?.images_directory) ?? ""]}
//             style={{ position: "fixed", top: 60, left: 0, zIndex: 0 }}
//           />
//           <Container
//             sx={{ height: "100vw", scrollSnapAlign: "start" }}
//           ></Container>
//           <Stack
//             sx={{
//               padding: 2,
//               zIndex: 10,
//               position: "relative",
//               backgroundColor: "background.paper",
//               scrollSnapAlign: "start",
//             }}
//             spacing={2}
//           >
//             <Box
//               justifyContent="space-between"
//               alignItems="center"
//               sx={{ display: "flex" }}
//             >
//               <Button
//                 variant="contained"
//                 color={data && dataRoom?.is_rented ? "error" : "success"}
//                 size="small"
//               >
//                 {dataRoom?.is_rented ? "DISEWA" : "TERSEDIA"}
//               </Button>
//               <IconButton>
//                 <FavoriteBorder />
//               </IconButton>
//             </Box>
//             <Box>
//               <Box
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{ display: "flex" }}
//               >
//                 <Typography
//                   gutterBottom
//                   variant="h5"
//                   component="div"
//                   fontWeight="bold"
//                   sx={{ textTransform: "capitalize" }}
//                 >
//                   {dataRoom?.Console.manufactur}
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-arrounf",
//                     alignItems: "center",
//                     marginLeft: "auto",
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     {dataRoom?.rating}
//                   </Typography>
//                   <IconButton>
//                     <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
//                   </IconButton>
//                 </Box>
//               </Box>
//               <Typography
//                 gutterBottom
//                 variant="h6"
//                 component="div"
//                 sx={{ textTransform: "capitalize" }}
//               >
//                 {dataRoom?.Console.name}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {dataRoom?.information}
//               </Typography>
//             </Box>

//             <Box>
//               <Typography
//                 gutterBottom
//                 variant="h6"
//                 component="div"
//                 fontWeight={600}
//               >
//                 Rp. {dataRoom?.price_per_hour}
//               </Typography>
//             </Box>

//             <Divider />
//             <Box alignItems="center" sx={{ display: "flex" }}>
//               <AvatarGroup max={4} total={dataRoom?.times_booked}>
//                 {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
//                 {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
//               <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
//               <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
//               <Avatar
//                 alt="Trevor Henderson"
//                 src="/static/images/avatar/5.jpg"
//               /> */}
//               </AvatarGroup>
//               <Typography ml={2} variant="body1" color="text.secondary">
//                 {dataRoom && getSimplifyNumber(dataRoom.times_booked ?? 0)}+
//                 telah menyewa ini
//               </Typography>
//             </Box>

//             <Divider />
//           </Stack>
//         </Container>
//       ) : (
//         <Loading />
//       )}
//       <PurchaseControl />
//     </>
//   );
// }
