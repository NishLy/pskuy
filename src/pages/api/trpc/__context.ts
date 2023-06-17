import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

// type req = IncomingMessage & {
//   cookies: Partial<{
//     [key: string]: string;
//   }>;
// };

export const createContext = async ({
  req,
}: {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}) => {
  return {
    uuid: req.cookies.uuid,
    username: req.cookies.name,
    user_type: req.cookies.user_type,
    email: req.cookies.email,
    profile_photo: req.cookies.profile_photo,
    token: req.cookies.token,
  };
};

export default createContext;
