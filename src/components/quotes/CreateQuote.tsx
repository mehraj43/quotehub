import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const CreateQuote: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('file', imageFile);

    setLoading(true);
    try {
      const response = await fetch(
        'https://crafto.app/crafto/v1.0/media/assignment/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      console.log({ data });
      setImageURL(data[0]?.url);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log({ imageURL, quoteText });
    // walking path to nowhere
    fetch('https://assignment.stage.crafto.app/postQuote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') ?? '',
      },
      body: JSON.stringify({ mediaUrl: imageURL, text: quoteText }),
    })
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
        toast({
          title: 'Success',
          description: 'Quote created successfully',
          variant: 'default',
        });
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error('Error creating quote:', error);
        toast({
          title: 'Error',
          description: 'Failed to create quote',
          variant: 'destructive',
        });
      });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log({ file });
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (!openDialog) {
      setImageFile(null);
      setImageURL(null);
      setQuoteText('');
      setLoading(false);
    }
  }, [openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <div className='fixed bottom-0 right-0 p-4'>
          <Button
            variant='default'
            className='w-14 h-14 rounded-full flex items-center justify-center'
            onClick={() => setOpenDialog(true)}
          >
            Create
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{`Create Quote's`}</DialogTitle>
          <DialogDescription>
            {`Add quote details and click save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* form fields */}
          <div className='space-y-2'>
            <Label htmlFor='image'>Image</Label>
            <Input
              id='image'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
            />
            <Button
              onClick={handleImageUpload}
              disabled={!imageFile || loading}
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quoteText'>Quote Text</Label>
            <Input
              id='quoteText'
              placeholder='Enter quote text'
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!imageURL || !quoteText}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuote;
