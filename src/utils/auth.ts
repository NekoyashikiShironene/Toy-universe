import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";


export default async function useSession() {
    const session = await getServerSession(authOptions);
    return session;
}
