import React from 'react';
import { ContentContainer } from '@/components/Containers';
import '../../styles/profile.css';
import useSession from '../../utils/auth';
import connectToDatabase from "@/utils/db";
import { setUsername } from '@/actions/setUsername';
import type { IUser } from "@/types/db";
import { UserSession } from '@/types/session';

export default async function AccountInfo() {
  const session = await useSession();
  const connection = await connectToDatabase();

  const [results] = await connection.query<IUser[]>("SELECT cus_id as id, username FROM customer WHERE cus_id=?", [(session?.user as UserSession)?.id]);

  //console.log(results);
  const result = results[0];

  return (
    <ContentContainer>
      <div className='profile-content'>
        <form action={setUsername}>
          <h1>My Profile</h1>

          <input type='hidden' name='id' defaultValue={result?.id} />

          <div className='user-info'>
            <p>Username: </p>
            <input type='text' name='username' />
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>

    </ContentContainer>
  )
}
