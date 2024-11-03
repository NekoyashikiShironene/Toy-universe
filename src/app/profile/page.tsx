import React from 'react';
import { ContentContainer } from '@/components/Containers';
import '../../styles/profile.css';
import useSession from '../../utils/auth';
import connectToDatabase from "@/utils/db";
import { updateAccount } from '@/actions/updateAccount';
import type { IUser } from "@/types/db";
import { UserSession } from '@/types/session';
import ProfilePicture from '@/components/ProfilePicture';
import { uploadProfilePicture } from '@/actions/upload';
import { redirect } from 'next/navigation';


export default async function ProfilePage() {
  const user = (await useSession())?.user as UserSession;

  const connection = await connectToDatabase();

  const [results] = await connection.query<IUser[]>("SELECT cus_id as id, username, password, name, email, tel, address, 'cus' AS role \
                                                          FROM customer WHERE cus_id=?  \
                                                          UNION SELECT emp_id as id, username, password, name, email, tel, 'None' as address, 'emp' AS role \
                                                          FROM employee WHERE emp_id=?", [user?.id, user?.id]);

  const result = results[0];

  const loggedInWithGoogle = user?.provider === 'google';
  const isEmployee = user?.role === 'emp';

  return (
    <ContentContainer>
      <div className='profile-content'>
        <h1>My Profile</h1>
        <div>
          <ProfilePicture src={user?.image} width={80} height={80} />
          <form action={uploadProfilePicture} className='upload-pic-form'>
            <input type='hidden' name='filename' value={user?.id} />
            <input type='hidden' name='filepath' value={'/users'} />
            <input className='profile-img-input' type='file' name='image' />
            <button type='submit' className='profile-submit'>Submit</button>
          </form>

        </div>

        <form action={updateAccount} className='profile-form'>

          <input type='hidden' name='id' defaultValue={result?.id} />

          <div className='user-info'>
            <p>Username: </p>
            <input type='text' className='read-only' name='username' defaultValue={result?.username} readOnly />
          </div>

          <div className='user-info'>
            
              <p>Name: </p>
              <input type='text' name='name' defaultValue={result?.name} />
            
          </div>

          <div className='user-info'>
            <p>Email: </p>
            <input type='email' name='email' defaultValue={result?.email} readOnly={loggedInWithGoogle} className={loggedInWithGoogle ? 'read-only' : ''} />
          </div>

          <div className='user-info'>
            <p>Tel.: </p>
            <input type='text' name='tel' defaultValue={result?.tel} />
          </div>

          <div className='user-info'>
            <p>Address: </p>
            <textarea name='address' defaultValue={result?.address} readOnly={isEmployee} className={isEmployee ? 'read-only' : ''} />
          </div>

          <button type='submit' className='profile-submit'>Submit</button>
        </form>
      </div>

    </ContentContainer>
  )
}
