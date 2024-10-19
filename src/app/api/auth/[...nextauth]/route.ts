import NextAuth, { Awaitable, RequestInternal, User } from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

// type Req = Pick<RequestInternal, "body" | "headers" | "query" | "method">;
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
            authorize: function (credentials: Credentials): Awaitable<User | null> {
                if (!credentials)
                    return null;

                // credentials?.username;
                // credentials?.password;
                // Add check username & password logic here

                // check username & encrypted password in database
                // Get email, image path

                const { username, password } = credentials;

                if (username === "admin" && password === "admin") {
                    const user = { 
                        id: "12433452", 
                        name: "Admin User", 
                        email: "Bla@gmail.com", 
                        image: "/user/.png",
                    };

                    return user;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            return { ...session, user: { ...session.user, id: token.id, role: token.role, cart: token.cart } };
        }, 
        
        async jwt({ token, trigger, session, user, account, profile }) {
            if (trigger === "update" && session?.name) {
                token.name = session.name
            }

            if (trigger === "update" && session?.cart) {
                    token.cart = session.cart;
              }

            if (account?.provider === "google") {
                // get user id from email
                const { email } = profile;
                token.id = "1212312121";
                token.role = "google_admin";
                token.cart = []
                //
            } 
            // Credential
            else if (user) {
                token.id = user.id
                token.role = "credentials_admin";
                token.cart = []
            }

            console.log("token", token);
            console.log("account", account);
            console.log("profile", profile);
              
            return token
          },
          
        async signIn({ account }) {
            
            if (account?.provider === "google") {
                return true;
            } 

            else if (account?.provider === "credentials") {
                // Add logic
                return true;
            }

            return false;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };