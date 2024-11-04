import React from 'react';
import { ContentContainer } from '@/components/Containers';
import '../../styles/profile.css';
import useSession from '../../utils/auth';
import { setUsername } from '@/actions/setUsername';
import { UserSession } from '@/types/session';
import { getUserId } from '@/db/user';

export default async function AccountInfo() {
  const session = await useSession();
  const user = session?.user as UserSession
  const result = await getUserId(user.id);

  return (
    <ContentContainer>
      <div className='profile-content'>
        <form action={setUsername}>
          <h1>My Profile</h1>

          <input type='hidden' name='id' defaultValue={result?.id} />
          <div className='user-info'>
            <p>Username: </p>
            <input type='text' name='username' pattern='^[A-Za-z][A-Za-z0-9_]{5,19}$' />
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>

    </ContentContainer>
  )
}
