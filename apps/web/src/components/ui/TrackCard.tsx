import type { ITrack } from '@repo/types';
import { FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

export function TrackCard({ track }: { track: ITrack }) {
  const navigate = useNavigate();
  // const deleteTrack = useStore((s) => s.deleteTrack);
  // const slideCount = useStore((s) => s.slides.filter((sl) => sl.track_id === track.id).length);

  return (
    <div
      onClick={() => navigate(`/track/${track.id}`)}
      className="group relative cursor-pointer rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{track.title}</h3>
            {track.description && (
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{track.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // deleteTrack(track.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      {/* <p className="mt-3 text-xs text-muted-foreground">{slideCount} slide{slideCount !== 1 ? 's' : ''}</p> */}
    </div>
  );
}
