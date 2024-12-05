'use client';

import { HoverEffect } from "@/components/ui/suggested-hover";
import { formatDistanceToNow } from "date-fns";
import { decode } from "html-entities";
import { useRouter } from "next/navigation";
import { LuDot } from "react-icons/lu";

interface VideoCardSuggestedProps {
    video: any; // Define a more specific type here if needed
    channelDetails: any; // Define a more specific type here if needed
}

const VideoCardSuggested = ({ video, channelDetails }: VideoCardSuggestedProps) => {
    const router = useRouter();
    const publishedAt = video.snippet.publishedAt;

    function formatCount(count: any): string {
        if (count === undefined || count === null || isNaN(count)) {
            return '0';
        }
        const numCount = Number(count);
        if (numCount >= 1000000) {
            return (numCount / 1000000).toFixed(2) + 'M';
        } else if (numCount >= 1000) {
            return (numCount / 1000).toFixed(2) + 'K';
        }
        return numCount.toFixed(0);
    }

    const timeAgo = publishedAt
        ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
        : "unknown publish date";

    const decodedTitle = decode(video.snippet.title);

    const handleCardClick = () => {
        router.push(`/watch/${video.id.videoId}`);
    };

    return (
        <HoverEffect className="p-0 sm:p-2 cursor-pointer">
            <div onClick={handleCardClick} className="flex flex-col sm:flex-row w-full gap-2 items-start justify-start">
                <div className="w-full sm:w-2/3 xl:1/3">
                    <img
                        src={video.snippet.thumbnails.high.url ?? '/default_thumbnail.jpg'}
                        alt={decodedTitle}
                        className="w-full sm:rounded-lg aspect-video object-cover"
                    />
                </div>
                <div className="hidden w-full sm:w-2/3 xl:w-2/3 sm:flex flex-col">
                    <h2 className="text-sm body-bold line-clamp-2">{decodedTitle}</h2>
                    <p className="inline-flex items-center text-xs text-gray-600 dark:text-white body">
                        {video.snippet.channelTitle}
                    </p>
                    <p className="inline-flex items-center text-xs text-gray-600 dark:text-white body-light">
                        {formatCount(channelDetails.statistics.viewCount)} <LuDot /> {timeAgo}
                    </p>
                </div>
                <div className="sm:hidden w-full sm:w-1/3 flex flex-col">
                    <h2 className="text-sm body-bold line-clamp-2 px-4">{decodedTitle}</h2>
                    <p className="inline-flex items-center text-xs text-gray-600 body px-4 py-2">
                        {video.snippet.channelTitle} <LuDot /> {formatCount(channelDetails.statistics.viewCount)} <LuDot /> {timeAgo}
                    </p>
                </div>
            </div>
        </HoverEffect>
    );
};

export default VideoCardSuggested;
