'use client';

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { formatDistanceToNow } from "date-fns";
import { decode } from "html-entities";
import { useRouter } from "next/navigation";
import { LuDot } from "react-icons/lu";

const VideoCard = ({ video, channel }: { video: any, channel?: any }) => {
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
            <div onClick={handleCardClick} className="flex flex-col w-full gap-2 items-start justify-start">
                <div>
                    <img
                        src={video.snippet.thumbnails.high.url ?? "/default_thumbnail.jpg"}
                        alt={decodedTitle}
                        className="w-full sm:rounded-xl aspect-video object-cover"
                    />
                </div>
                <div className="flex w-full items-start justify-start gap-2">
                    <div className="flex py-2 sm:py-0 pl-4 sm:pl-0 w-1/6">
                        <img
                            src={channel?.snippet?.thumbnails.high.url ?? "/default.jpg"}
                            alt={"N/A"}
                            className="w-10 h-auto rounded-full object-cover"
                        />
                    </div>
                    <div className="w-5/6">
                        <div className="hidden w-full sm:flex flex-col">
                            <h2 className="text-sm body-bold line-clamp-2">{decodedTitle}</h2>
                            <p className="inline-flex items-center text-xs text-gray-600 dark:text-white body">
                                {video.snippet.channelTitle}
                            </p>
                            <p className="inline-flex items-center text-xs text-gray-600 dark:text-white body-light">
                                {formatCount(channel?.statistics.viewCount)} <LuDot /> {timeAgo}
                            </p>
                        </div>
                        <div className="sm:hidden w-full flex flex-col py-2 mb-4 sm:mb-0">
                            <h2 className="text-sm body-bold line-clamp-2 pr-4 sm:px-0">{decodedTitle}</h2>
                            <p className="inline-flex items-center text-xs text-gray-600 dark:text-white body-light pr-4 sm:px-0">
                                {video.snippet.channelTitle} <LuDot /> {formatCount(channel?.statistics.viewCount)} <LuDot /> {timeAgo}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HoverEffect>
    );
};

export default VideoCard;
