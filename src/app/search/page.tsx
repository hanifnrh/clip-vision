'use client';

import { Dots } from '@/components/ui/dots';
import VideoCard from '@/components/ui/videocard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type VideoItem = {
    id: { videoId: string };
    snippet: { channelId: string };
};

type ChannelDetails = {
    id: string;
    snippet: Record<string, any>;
    statistics: Record<string, any>;
};

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [channels, setChannels] = useState<Record<string, ChannelDetails>>({});
    const [loading, setLoading] = useState<boolean>(true);

    const fetchVideosAndChannels = async () => {
        if (!query) return;

        const videoUrl = `https://youtube-v31.p.rapidapi.com/search?q=${query}&part=id%2Csnippet&type=video&maxResults=50`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(videoUrl, options);
            const result = await response.json();

            const videoItems: VideoItem[] = result.items || [];
            setVideos(videoItems);

            // Fetch channel data
            const channelIds = [...new Set(videoItems.map((item) => item.snippet.channelId))];

            const channelData: Record<string, ChannelDetails> = {};
            for (const channelId of channelIds) {
                if (typeof channelId !== 'string') continue;

                const channelUrl = `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics&id=${channelId}`;
                const channelResponse = await fetch(channelUrl, options);
                const channelResult = await channelResponse.json();
                channelData[channelId] = channelResult.items[0];
            }

            setChannels(channelData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setVideos([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchVideosAndChannels();
        }
    }, [query]);

    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:px-8 lg:px-20 py-4">
            <main className="w-full flex flex-col gap-8 items-center justify-center">
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <Dots />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <VideoCard
                                    key={video.id.videoId}
                                    video={video}
                                    channel={channels[video.snippet.channelId as string]} // Pass channel data
                                />
                            ))
                        ) : (
                            <p className='text-center'>No videos found for your query.</p> // Display message if no videos are found
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<Dots />}>
            <SearchContent />
        </Suspense>
    );
}
