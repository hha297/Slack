import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ConversationHeroProps {
        memberName?: string;
        memberImage?: string;
}

export const ConversationHero = ({ memberName = 'Member', memberImage }: ConversationHeroProps) => {
        return (
                <div className="mt-10 mx-5 mb-4 ">
                        <div className="flex items-center gap-x-1 mb-2">
                                <Avatar className="size-12 mr-2">
                                        <AvatarImage alt={memberName} src={memberImage} className="rounded-md" />
                                        <AvatarFallback>{memberName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold flex items-center mb-2">{memberName}</p>
                        </div>
                        <p className="font-normal text-slate-800 my-4">
                                This is the first message with <strong>@{memberName}</strong>
                        </p>
                </div>
        );
};
