import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
        url: string | undefined | null;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
        if (!url) return null;
        return (
                <Dialog>
                        <DialogTrigger>
                                <div className="relative overflow-hidden max-w-sm border rounded-lg my-2 cursor-zoom-in">
                                        <img src={url} alt="thumbnail" className="rounded-md object-cover size-full" />
                                </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
                                <img src={url} alt="thumbnail" className="rounded-md object-cover size-full" />
                        </DialogContent>
                </Dialog>
        );
};
