import { ISlide, ITrack } from '@repo/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { createSlide } from '@/apis/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ITrackWithSlideProps {
  trackData: { track: ITrack; slides: ISlide[] };
  setTrackData: (data: { track: ITrack; slides: ISlide[] }) => void;
}

export function CreateSlideDialog(trackWithSlides: ITrackWithSlideProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;
    let position = 5;
    if (trackWithSlides.trackData.slides.length) {
      const lastPosition = Number(
        trackWithSlides.trackData.slides[trackWithSlides.trackData.slides.length - 1].position,
      );
      position += lastPosition;
    }
    const slide = await createSlide({ track_id: trackWithSlides.trackData.track.id, title: title.trim(), position });
    trackWithSlides.setTrackData({
      track: trackWithSlides.trackData.track,
      slides: [...trackWithSlides.trackData.slides, slide],
    });
    setTitle('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Slide
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new slide</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="slide-title">Title</Label>
            <Input
              id="slide-title"
              placeholder="Slide title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
