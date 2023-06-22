import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import cookies from "@/lib/cookies";
import { useRouter } from "next/router";
import AppContext from "@/context/app";
import SellIcon from "@mui/icons-material/Sell";
import {
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    style: {
      backgroundColor: trigger ? "#274594" : "transparent",
    },
  });
}

export default function ElevateAppBar() {
  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar color="black" sx={{ padding: 0 }}>
            <PrimarySearchAppBar />
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "60%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userContext, setUserContext] = React.useContext(AppContext);
  const [expandSearch, setExpandSearch] = React.useState(false);
  const [seacrhHistory, setSeacrhHistory] = React.useState<string[]>([]);
  const [search, setSeacrh] = React.useState<string>("");

  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHistoryChange = (arr: string[]) => {
    setSeacrhHistory(arr);
  };

  const handleHistoryClick = (history: string) => {
    setSeacrh(history);
  };

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSeacrh(evt.currentTarget.value);
  };

  const handleSubmitSearch = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (evt.currentTarget.value === "") return;
    const data = new FormData(evt.currentTarget);
    setSeacrhHistory([data.get("search")?.toString() ?? "", ...seacrhHistory]);
    setExpandSearch(false);
    router.push({
      query: { search: data.get("search")?.toString() ?? "" },
      pathname: "/search",
    });
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <Link href={"/account"}>Profile</Link>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setUserContext &&
            setUserContext({
              email: undefined,
              profile_photo: undefined,
              token: undefined,
              user_type: undefined,
              username: undefined,
              uuid: undefined,
            });
          cookies.destroy();
          router.replace("/signin");
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Container
        sx={{
          padding: 1,
          height: expandSearch ? "100vh" : "fit-content",
          backgroundColor: expandSearch ? "background.paper" : "transparent",
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          component="form"
          onSubmit={handleSubmitSearch}
        >
          {expandSearch && (
            <IconButton onClick={() => setExpandSearch(false)}>
              <ArrowBackIcon sx={{ color: "black", width: 30, height: 30 }} />
            </IconButton>
          )}
          <Search
            sx={{
              height: "fit-content",
              backgroundColor: "black!",
              width: expandSearch ? "100%" : "70%",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon sx={{ color: expandSearch ? "black" : "white" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              name="search"
              onChange={handleSearchChange}
              value={search}
              sx={
                expandSearch
                  ? {
                      outline: 1,
                      outlineColor: "rgba(0, 0, 0, 0.5)",
                      outlineStyle: "solid",
                      borderRadius: 1,
                      color: "black",

                      fontSize: "larger",
                    }
                  : { color: "white", fontSize: "larger" }
              }
              fullWidth
              onClick={() => setExpandSearch(true)}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {!expandSearch && (
            <Box
              sx={{
                display: { xs: "flex", md: "flex" },
                marginLeft: "auto",
                height: "fit-content",
              }}
            >
              <IconButton
                size="large"
                color="inherit"
                sx={{ padding: 1 }}
                onClick={handleProfileMenuOpen}
              >
                {userContext?.user_type === "owner" ? (
                  <Badge
                    badgeContent={<SellIcon sx={{ width: 20, height: 20 }} />}
                    color="success"
                    sx={{ top: 1 }}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <AccountCircle
                      sx={{
                        color: "white",
                        width: 35,
                        height: 35,
                      }}
                    />
                  </Badge>
                ) : (
                  <AccountCircle
                    sx={{
                      color: "white",
                      width: 35,
                      height: 35,
                    }}
                  />
                )}
              </IconButton>
            </Box>
          )}
        </Stack>
        {renderMenu}
        {expandSearch && (
          <SearchHistory
            searchArr={seacrhHistory}
            onClick={handleHistoryClick}
            onDelete={handleHistoryChange}
          />
        )}
      </Container>
    </>
  );
}

function SearchHistory(props: {
  searchArr: string[];
  onDelete?: (param: string[]) => void;
  onClick?: (param: string) => void;
}) {
  return (
    <List sx={{ height: "calc(100vh-60px)", overflowY: "auto" }}>
      {props.searchArr.map((data, i) => (
        <ListItem
          key={i}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() =>
                props.onDelete &&
                props.onDelete(props.searchArr.filter((e) => e !== data))
              }
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <AccessTimeIcon
              sx={{ color: "rgba(0, 0, 0, 0.5)", width: 30, height: 30 }}
            />
          </ListItemAvatar>
          <ListItemText
            color="black"
            primary={
              <Typography
                variant="body1"
                color="black"
                onClick={() => props.onClick && props.onClick(data)}
              >
                {data}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
