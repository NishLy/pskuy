import { verifyJWT } from "./jwt";

async function verifyToken(bearerToken: string | undefined) {
  const token = bearerToken?.split(" ")[1];
  if (!token) return false;
  const result = await verifyJWT(token).catch((err) => err);

  return result ? true : false;
}

export default verifyToken;
