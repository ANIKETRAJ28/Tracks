import { ITrack } from '@repo/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { createTrack } from '@/apis/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ITrackListProp {
  tracks: ITrack[];
  setTracks: (tracks: ITrack[]) => void;
}

export function CreateTrackDialog({ tracks, setTracks }: ITrackListProp) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;
    const track = await createTrack(title.trim(), description.trim());
    setTracks([track, ...tracks]);
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Track
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new track</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="track-title">Title</Label>
            <Input
              id="track-title"
              placeholder="My Track"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="track-desc">Description</Label>
            <Textarea
              id="track-desc"
              placeholder="What is this track about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
