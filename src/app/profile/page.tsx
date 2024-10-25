import React from 'react';
import { ContentContainer } from '@/components/Containers';
import '../../styles/profile.css';
import useSession from '../../utils/auth';
import connectToDatabase from "@/utils/db";
import { updateAccount } from '@/actions/updateAccount';
import type { IUser } from "@/types/db";
import { UserSession } from '@/types/session';


export default async function ProfilePage() {
  const session = await useSession();
  const connection = await connectToDatabase();

  const [results] = await connection.query<IUser[]>("SELECT cus_id as id, username, password, name, email, tel, address, 'cus' AS role \
                                                          FROM customer WHERE cus_id=?", [(session?.user as UserSession)?.id]);

  connection.release();

  //console.log(results);
  const result = results[0];

  return (
    <ContentContainer>

      <div className='profile-content'>
        <form action={updateAccount}>
          <h1>My Profile</h1>

          <input type='hidden' name='id' defaultValue={result?.id} />

          <div className='user-info'>
            <p>Username: </p>
            <input type='text' id='username' name='username' defaultValue={result?.username} readOnly/>
          </div>

          <div className='user-info'>
            <p>Name: </p>
            <input type='text' name='name' defaultValue={result?.name} />
          </div>

          <div className='user-info'>
            <p>Email: </p>
            <input type='email' name='email' defaultValue={result?.email} />
          </div>

          <div className='user-info'>
            <p>Tel.: </p>
            <input type='text' name='tel' defaultValue={result?.tel} />
          </div>

          <div className='user-info'>
            <p>Address: </p>
            <textarea name='address' defaultValue={result?.address} />
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>

    </ContentContainer>
  )
}
