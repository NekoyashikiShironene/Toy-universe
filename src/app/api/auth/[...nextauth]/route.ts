import NextAuth, { Awaitable, RequestInternal, User } from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

type Req = Pick<RequestInternal, "body" | "headers" | "query" | "method">;
type Credentials = Record<"username" | "password", string> | undefined;

export const authOptions: AuthOptions = {
    secret: "asjkjaofjasilrjeoijfaopufw3fui90urt90439opfvajf",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Username",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Baramee123" },
                password: { label: "Password", type: "password" }
            },
            authorize: function (credentials: Credentials, req: Req): Awaitable<User | null> {
                if (!credentials)
                    return null;

                // credentials?.username;
                // credentials?.password;
                // Add check username & password logic here

                throw new Error("Function not implemented.");
            }
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            console.log(account);
            if (account?.provider === "google") {
                console.log(profile);

                // Add logic
                return true;
            }
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };