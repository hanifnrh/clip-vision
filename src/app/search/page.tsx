'use client';

import { Dots } from '@/components/ui/dots';
import VideoCard from '@/components/ui/videocard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    console.log(query);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchVideos = async () => {
        if (!query) return;
        const url = `https://youtube-v31.p.rapidapi.com/search?q=${query}&part=id%2Csnippet&type=video&maxResults=50`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'f6c6a4693dmshf0cd805b8522a5fp13b082jsnd6a58e363b55',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            if (result.items) {
                setVideos(result.items);
            } else {
                setVideos([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setVideos([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchVideos();
        }
    }, [query]);

    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:px-8 lg:px-20 py-4">
            <main className="w-full h-screen flex flex-col gap-8 items-center justify-center">
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <Dots />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos && videos.length > 0 ? (
                            videos.map((video) => (
                                <VideoCard key={video.id.videoId} video={video} />
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
