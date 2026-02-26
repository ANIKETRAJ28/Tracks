import { ITrack } from '@repo/types';
import { useEffect, useState } from 'react';

import { getTracks } from '@/apis/api';
import { CreateTrackDialog } from '@/components/CreateTrackDialog';
import { TrackCard } from '@/components/ui/TrackCard';

export function Home() {
  const [tracks, setTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      const currTracks = await getTracks();
      setTracks(currTracks);
    }
    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            {/* <Layers className="h-5 w-5 text-foreground" /> */}
            <span className="text-lg font-semibold text-foreground">Tracks</span>
          </div>
          <CreateTrackDialog tracks={tracks} setTracks={setTracks} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary mb-4">
              {/* <Layers className="h-6 w-6 text-muted-foreground" /> */}
            </div>
            <h2 className="text-lg font-medium text-foreground">No tracks yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create your first track to get started.</p>
            <div className="mt-6">
              <CreateTrackDialog tracks={tracks} setTracks={setTracks} />
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
