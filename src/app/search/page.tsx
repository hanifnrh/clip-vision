'use client';

import { Dots } from '@/components/ui/dots';
import VideoCard from '@/components/ui/videocard';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    console.log(query);
    const [videos, setVideos] = useState<any[]>([]); // Ensure videos is always an array
    const [loading, setLoading] = useState<boolean>(true);

    const fetchVideos = async () => {
        if (!query) return;
        const url = `https://youtube-v31.p.rapidapi.com/search?q=${query}&part=id%2Csnippet&type=video&maxResults=50`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'efa326abc6mshb0cdb1f33157ceep1f924fjsn15ea53e1a274',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);  // Log the API response for inspection
            if (result.items) {
                setVideos(result.items); // Ensure result.items is set properly
            } else {
                setVideos([]); // Set an empty array if no items are returned
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setVideos([]); // Set an empty array in case of error
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchVideos(); // Fetch videos when query exists
        }
    }, [query]);

    return (
        <div className="flex items-center justify-center min-h-screen px-0 sm:px-8 lg:px-20 py-4">
            <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
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
