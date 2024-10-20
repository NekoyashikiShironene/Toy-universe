import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/utils/db";
import NextCrypto from 'next-crypto';
import type { ICustomer } from "@/types/db";

// type Req = Pick<RequestInternal, "body" | "headers" | "query" | "method">;
type Credentials = Record<"username" | "password", string> | undefined;


export const authOptions: AuthOptions = {
    secret: process.env.SESSION_SECRET,
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
            authorize: async (credentials: Credentials) => {
                
                if (!credentials)
                    return null;

                
                // credentials?.username;
                // credentials?.password;
                // Add check username & password logic here

                // check username & encrypted password in database
                // Get email, image path

                const { username } = credentials;
                
                const connection = await connectToDatabase();


                const [ results ]  = await connection.query<ICustomer[]>("SELECT * FROM customer WHERE username = ?", [username]);
                const crypto = new NextCrypto(process.env.CRYPTO_SECRET ?? "");                

                console.log(results[0]);
                
                if (results) {
                    const password = results[0].password ?? "";
                    const encrypted = await crypto.encrypt(password); 
                    const decrypted = await crypto.decrypt(encrypted);
                    console.log("decrypt", decrypted);

                    const user = {
                        id: results[0].cus_id?.toString() as string,
                        name: results[0].name,
                        email: results[0].email,
                        image: "/user/" + results[0].username + ".png"
                    }

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
                if (session?.name)
                    token.name = session.name
                if (session?.cart)
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