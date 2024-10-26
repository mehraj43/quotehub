'use client';
import React from 'react';
import CreateQuote from '@/components/quotes/CreateQuote';
import QuotesList from '@/components/quotes/QuotesList';

const Quotes: React.FC = () => {
  return (
    <>
      <QuotesList />
      <CreateQuote />
    </>
  );
};

export default Quotes;
