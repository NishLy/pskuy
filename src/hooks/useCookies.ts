import cookies from "@/lib/cookies";

export default function useUserCookies() {
  return {
    email: cookies.get("email"),
    profile_photo: cookies.get("profile_photo"),
    token: cookies.get("token"),
    user_type: cookies.get("user_type"),
    username: cookies.get("username"),
    uuid: cookies.get("uuid"),
  };
}
