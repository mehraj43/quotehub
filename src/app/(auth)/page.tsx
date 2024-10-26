'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function Auth() {
  const router = useRouter();
  const { toast } = useToast();
  // const { setToken, token } = useContext(AuthContext);

  const [auth, setAuth] = useState({
    username: '',
    otp: '',
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in',
        variant: 'default',
      });
      router.push('/quotes');
    }
  }, []);

  const handeAuthChange = (key: string, value: string) => {
    setAuth({ ...auth, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch('https://assignment.stage.crafto.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auth),
    })
      .then((response) => {
        if (response.status === 401) {
          toast({
            title: 'Invalid Credentials',
            description: 'Please enter correct username and otp',
            variant: 'destructive',
          });
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then((data) => {
        // setToken(data.token);
        localStorage.setItem('token', data.token);
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in',
          variant: 'default',
        });
        router.push('/quotes');
      })
      .catch((error) => {
        console.error('Error:', error);
        // setToken(null);
        localStorage.removeItem('token');
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col justify-center items-center bg-gray-50 shadow-lg rounded-lg p-8 max-w-sm w-full mx-auto mt-20'
    >
      <h2 className='text-2xl font-semibold mb-6'>Login</h2>

      <label
        className='w-full text-gray-700 text-sm font-bold mb-2'
        htmlFor='username'
      >
        Username
      </label>
      <Input
        id='username'
        onChange={(e) => handeAuthChange('username', e.target.value)}
        type='text'
        placeholder='Enter your username'
        className='w-full mb-4 py-2 px-3 border rounded-lg text-gray-700'
        required
      />

      <label
        className='w-full text-gray-700 text-sm font-bold mb-2'
        htmlFor='otp'
      >
        OTP
      </label>
      <InputOTP
        id='otp'
        onChange={(value) => handeAuthChange('otp', value)}
        maxLength={4}
        className='flex justify-between w-full mb-4'
      >
        <InputOTPGroup className='space-x-2'>
          <InputOTPSlot
            index={0}
            className='border rounded-lg p-2 w-12 text-center text-lg'
          />
          <InputOTPSlot
            index={1}
            className='border rounded-lg p-2 w-12 text-center text-lg'
          />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup className='space-x-2'>
          <InputOTPSlot
            index={2}
            className='border rounded-lg p-2 w-12 text-center text-lg'
          />
          <InputOTPSlot
            index={3}
            className='border rounded-lg p-2 w-12 text-center text-lg'
          />
        </InputOTPGroup>
      </InputOTP>

      <div className='text-center text-sm text-gray-600 my-6'>
        {auth.otp === '' ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {auth.otp}</>
        )}
      </div>

      <Button
        type='submit'
        disabled={auth.username === '' || auth.otp.length < 4}
        variant={
          auth.username === '' || auth.otp.length < 4 ? 'secondary' : 'default'
        }
      >
        Submit
      </Button>
    </form>
  );
}

export default Auth;
