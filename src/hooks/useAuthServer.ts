import createTRPCContext from "@/pages/api/trpc/context";
import { verifyJWT } from "@/utils/jwt";
import { inferAsyncReturnType } from "@trpc/server";

export default async function useAuth(
  cookies?: inferAsyncReturnType<typeof createTRPCContext>
) {
  if (!cookies) return false;
  if (!(await verifyJWT(cookies.token ?? ""))) return false;
  return true;
}
