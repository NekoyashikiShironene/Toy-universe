import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import connectToDatabase from "@/utils/db";
import NextCrypto from 'next-crypto';
import type { ICustomer, IUser } from "@/types/db";
import type { ResultSetHeader } from "mysql2";
import fs from "fs";

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

                const { username, password } = credentials;
                const connection = await connectToDatabase();
                const [results] = await connection.query<ICustomer[]>("SELECT emp_id as id, username, password, name, email, 'emp' AS role \
                                                                        FROM employee WHERE username=? \
                                                                        UNION \
                                                                        SELECT cus_id as id, username, password, name, email, 'cus' AS role \
                                                                        FROM customer WHERE username=?", [username, username]);

                const crypto = new NextCrypto(process.env.CRYPTO_SECRET ?? "");
                const result = results[0];

                if (result) {
                    const encryptedPassword = result.password ?? "";

                    const decryptedPassword = await crypto.decrypt(encryptedPassword);

                    if (password === decryptedPassword) {
                        const user = {
                            id: result.id?.toString() as string,
                            name: result.name,
                            email: result.email,
                            image: `/users/${result.id}.jpg`
                        }

                        return user;
                    }

                    return null;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            const userId = token.id;
            let userImagePath = session.user?.image;

            if (fs.existsSync(`public/users/${userId}.jpg`)) {
                userImagePath = `${process.env.NEXT_PUBLIC_URL}/users/${userId}.jpg`;
            }

            return {
                ...session,
                user: {
                    ...session.user,
                    image: userImagePath,
                    id: token.id,
                    role: token.role,
                    cart: token.cart,
                    provider: token.provider
                }
            };
        },

        async jwt({ token, trigger, session, user, account, profile }) {
            if (trigger === "update") {
                if (session?.name)
                    token.name = session.name
                if (session?.cart)
                    token.cart = session.cart;
            }

            if (account?.provider === "google") {
                // get user id from email

                const connection = await connectToDatabase();
                const email = profile?.email;

                const [results] = await connection.query<IUser[]>("SELECT emp_id as id, username, password, name, email, 'emp' AS role \
                    FROM employee WHERE email=? \
                    UNION \
                    SELECT cus_id as id, username, password, name, email, 'cus' AS role \
                    FROM customer WHERE email=?", [email, email]);

                const result = results[0];

                let id, role;
                if (result) {
                    id = result.id;
                    role = result.role;
                } else {
                    const [result] = await connection.query<ResultSetHeader>("INSERT INTO customer(name, email) VALUES (?, ?)", [profile?.name, email]);
                    id = result.insertId;
                    role = "cus";
                }
                token.id = id;
                token.role = role;
                token.cart = [];
                token.provider = account?.provider;

                connection.release();

            }
            // Credential
            else if (user) {

                const connection = await connectToDatabase();
                const [results] = await connection.query<IUser[]>("SELECT emp_id as id, 'emp' AS role \
                    FROM employee WHERE emp_id=? \
                    UNION \
                    SELECT cus_id as id, 'cus' AS role \
                    FROM customer WHERE cus_id=?", [user.id, user.id]);

                const result = results[0];
                token.id = user.id
                token.role = result.role;
                token.cart = []
                token.provider = 'credential';

            }


            return token
        },

        async signIn({ account }) {
            if (account?.provider === "google") {

                return true;
            }
            return true; // Do different verification for other providers that don't have `email_verified`
        },
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };