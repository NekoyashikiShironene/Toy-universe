'use client';
import React, { useEffect } from 'react';
import { ContentContainer } from '@/components/Containers';
import '@/styles/profile.css';
import { useSession } from "next-auth/react";
import { useFormState } from 'react-dom';
import { UserSession } from '@/types/session';
import { changePassword } from '@/actions/updateAccount';

export default function PasswordPage() {
  const { data: session } = useSession();
  const [state, formAction] = useFormState(changePassword, null);
  const user = (session)?.user as UserSession;

  useEffect(() => {
    const message = document.getElementById('result-message');
    
    if (state?.success) {
        document.querySelectorAll(".user-info input")
            .forEach(
                input => (input as HTMLInputElement).value = ""
            );
            
          message!.className = "success";
    }
    else {
        message!.className = "error";          
    }
        
}, [state])

  return (
    <ContentContainer>
      <div className='profile-content'>
        <h1>Setting Password</h1>
        
        <form action={formAction} className='profile-form'>

          <input type='hidden' name='id' defaultValue={user?.id} />

          <div className='user-info'>
            <p>New Password: </p>
            <input type='password' name='password1' pattern='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$' required />
          </div>

          <div className='user-info'>
            <p>Confirm Password: </p>
            <input type='password' name='password2' pattern='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$' required />
          </div>
          
          <button type='submit' className='profile-submit'>Submit</button>
        </form>

          <p id='result-message'>{state?.message}</p>
      </div>

    </ContentContainer>
  )
}
