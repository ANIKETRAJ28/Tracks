import { ISlide, ITrack } from '@repo/types';
import { ArrowLeft, GripVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getTrackWithSlides } from '@/apis/api';
import { CreateSlideDialog } from '@/components/CreateSlideDialog';
import { Button } from '@/components/ui/button';

const TrackPage = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [trackData, setTrackData] = useState<{ track: ITrack; slides: ISlide[] }>();

  useEffect(() => {
    async function fetchSlides() {
      if (trackId === undefined) return;
      const currTrackData: { track: ITrack; slides: ISlide[] } = await getTrackWithSlides(trackId);
      setTrackData(currTrackData);
    }
    fetchSlides();
  }, []);

  if (!trackData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground">Track not found</h2>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">{trackData.track.title}</h1>
            {trackData.track.description && (
              <p className="text-sm text-muted-foreground">{trackData.track.description}</p>
            )}
          </div>
          <CreateSlideDialog trackData={trackData} setTrackData={setTrackData} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {trackData.slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-lg font-medium text-foreground">No slides yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add a slide to this track.</p>
            <div className="mt-6">
              <CreateSlideDialog trackData={trackData} setTrackData={setTrackData} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {trackData.slides.map((slide, i) => (
              <div
                key={slide.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="flex h-7 w-7 items-center justify-center rounded bg-secondary text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-card-foreground">{slide.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackPage;
