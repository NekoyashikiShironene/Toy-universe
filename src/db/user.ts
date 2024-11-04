import connectToDatabase from "@/utils/db";
import { unstable_cache } from "next/cache";
import type { IUser, OptionalValue } from "@/types/db";

export const getUser = unstable_cache(
    async (user_id: OptionalValue) => {
        const connection = await connectToDatabase();
        const [results] = await connection.query<IUser[]>(
            "SELECT cus_id as id, username, password, name, email, tel, address, 'cus' AS role \
            FROM customer WHERE cus_id=?  \
            UNION SELECT emp_id as id, username, password, name, email, tel, 'None' as address, 'emp' AS role \
            FROM employee WHERE emp_id=?", 
            [user_id, user_id]
        );
        return results[0];
    },
    ["userCache"],
    {
        revalidate: 60 * 60 * 24,
        tags: ["user"]
    }

)

export const getUserId = async (user_id: OptionalValue) => {
    const connection = await connectToDatabase();
    const [results] = await connection.query<IUser[]>(
        "SELECT cus_id as id, username FROM customer WHERE cus_id=?", 
        [user_id]
    );
    return results[0];
}