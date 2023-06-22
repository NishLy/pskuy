import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import AppContext from "@/context/app";
import ExploreIcon from "@mui/icons-material/Explore";

// interface Props extends ScriptProps {
//   menuSelected: number;
//   setMenuSelected: React.Dispatch<React.SetStateAction<number>>;
// }

export default function FixedBottomNavigation() {
  const [menuSelected, setMenuSelected] = React.useState(-1);

  const [userContext] = React.useContext(AppContext);
  const router = useRouter();

  React.useEffect(() => {
    switch (menuSelected) {
      case 0:
        router.push("/home");
        break;
      case 1:
        router.push("/explore");
        break;
      case 2:
        router.push("/transaction");
        break;
      case 3:
        router.push("/manage/rental");
        break;
    }
  }, [menuSelected]);

  React.useEffect(() => {
    switch (router.pathname) {
      case "/home":
        setMenuSelected(0);
        break;
      case "/explore":
        setMenuSelected(1);
        break;
      case "/transaction":
        setMenuSelected(2);
        break;
      case "/manage/rental":
        setMenuSelected(3);
        break;
    }
  }, [0, router.pathname]);

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={menuSelected}
        onChange={(_event, newValue) => {
          setMenuSelected(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Explore" icon={<ExploreIcon />} />
        <BottomNavigationAction
          // BUAT PAGES TRANSACTION DETAIL TRANSAKSI DI PAGES DGN NAMA TRANSAKSI
          // ROUTE HALAMAN BISA DILIHAT DI VIEW - ACCOUNT

          label={
            userContext?.user_type === "owner"
              ? "Kelola Order"
              : "Daftar Transaksi"
          }
          icon={<LocalMallIcon />}
        />

        {userContext?.user_type === "owner" && (
          <BottomNavigationAction label="Kelola" icon={<StorefrontIcon />} />
        )}
      </BottomNavigation>
    </Paper>
  );
}
