import { format } from 'date-fns';

interface ChannelHeroProps {
        channelName: string;
        channelCreationTime: number;
}

export const ChannelHero = ({ channelName, channelCreationTime }: ChannelHeroProps) => {
        return (
                <div className="mt-10 mx-5 mb-4 ">
                        <p className="text-2xl font-bold flex items-center mb-2">#{channelName}</p>
                        <p className="font-normal text-slate-800 mb-4">
                                This channel was created on {format(channelCreationTime, 'MMM do, yyyy')}. This is the
                                first message of the #{channelName} channel
                        </p>
                </div>
        );
};
