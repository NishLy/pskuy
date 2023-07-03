import UserContext from "@/context/app";
import cookies from "@/lib/cookies";
import React from "react";

export default function useAuth() {
  // const [userContext] = React.useContext(UserContext);
  if (!cookies.get("uuid") || !cookies.get("token")) return false;
  if (cookies.get("uuid") === "" || cookies.get("token") === "") return false;
  // if (!userContext) return false;
  // if (!userContext.token || !userContext.uuid || !userContext.username)
  //   return false;
  // if (
  //   userContext.token === "" ||
  //   userContext.uuid === "" ||
  //   userContext.username === ""
  // )
  //   return false;
  return true;
}
