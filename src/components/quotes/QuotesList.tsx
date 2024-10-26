'use client';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/formatData';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, useCallback } from 'react';

interface Quotes {
  id: number;
  username: string;
  text: string;
  mediaUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const QuotesList: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [quotesList, setQuotesList] = useState<Quotes[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const fetchQuotes = useCallback(() => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    fetch(
      `https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ?? '',
        },
      }
    )
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('token');
          toast({
            title: 'Invalid Credentials',
            description: 'Please login again',
            variant: 'destructive',
          });
          router.push('/');
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then((data) => {
        if (data.data.length === 0) {
          setHasMore(false);
          return;
        }
        setQuotesList((prevQuotes) => [...prevQuotes, ...data.data]);
        setOffset((prevOffset) => prevOffset + 20);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [offset, hasMore]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    const currentObserverRef = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingRef.current) {
          fetchQuotes();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (currentObserverRef) observer.unobserve(currentObserverRef);
    };
  }, [fetchQuotes, hasMore]);

  return (
    <div className='flex flex-wrap justify-center mt-10'>
      {quotesList.map((quote, index) => (
        <div
          ref={hasMore ? observerRef : null}
          className='p-4 max-w-sm w-[300px]'
          key={`${quote.id}-${index}`}
        >
          <div className='flex rounded-lg h-full flex-col'>
            <div className='relative'>
              <Image
                src={
                  quote.mediaUrl && quote.mediaUrl.startsWith('http')
                    ? quote.mediaUrl
                    : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                }
                alt='image'
                width={250}
                height={100}
                className='h-60 w-[300px] object-cover'
              />
              <p className='absolute bottom-0 left-0 m-2 capitalize'>
                {quote?.text?.length > 40
                  ? `${quote.text.slice(0, 40)}...`
                  : quote?.text}
              </p>
            </div>
            <div className='flex flex-row justify-between items-center gap-1 flex-wrap'>
              <p className='text-sm text-gray-500 capitalize text-wrap'>
                {quote?.username?.length > 7
                  ? `${quote?.username.slice(0, 7)}...`
                  : quote?.username}
              </p>
              <p className='text-sm text-gray-500'>
                {formatDate(quote.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuotesList;
