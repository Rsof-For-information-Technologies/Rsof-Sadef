"use client";

import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import HttpError from '@/utils/httpError';
import NotFoundPage from '../not-found';
import useError from '@/hooks/useError';

interface ErrorProps {
  error?: HttpError;
}

const GlobalError: NextPage<ErrorProps> = (data) => {
  const { errorCode } = useError(data)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>

      <p>
        {
          errorCode === 404
            ? <NotFoundPage />
            : null
        }
      </p>
      <Link href="/">
        Go back to Home
      </Link>
    </div>
  );
};

export default GlobalError;
