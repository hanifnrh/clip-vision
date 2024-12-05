'use client';

import { Button } from '@/components/ui/button';
import VideoCardSuggested from '@/components/ui/videocard-suggested';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Download, Ellipsis, ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuDot } from 'react-icons/lu';

export default function VideoPlayer() {
    const pathname = usePathname();
    const videoId = pathname.split('/').pop();
    const [videoDetails, setVideoDetails] = useState<any>(null);
    const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [channelDetails, setChannelDetails] = useState<any>(null);

    function formatCount(count: number): string {
        if (count === undefined || isNaN(count)) {
            return '0'; // Or any fallback value you'd like to display
        }
        if (count >= 1000000) {
            return (count / 1000000).toFixed(2) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(2) + 'K';
        }
        return count.toFixed(0);
    }

    const fetchSuggestedVideos = async () => {
        const url = `https://youtube-v31.p.rapidapi.com/search?relatedToVideoId=${videoId}&part=id%2Csnippet&type=video&maxResults=10`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setSuggestedVideos(result.items || []); // Ensure it's an array
            setLoading(false);
        } catch (error) {
            console.error('Error fetching suggested videos:', error);
            setLoading(false);
        }
    };

    const fetchVideoDetails = async () => {
        const url = `https://youtube-v31.p.rapidapi.com/videos?part=snippet%2Cstatistics&id=${videoId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setVideoDetails(result.items[0] || null);
        } catch (error) {
            console.error('Error fetching video details:', error);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchVideoDetails();
            fetchSuggestedVideos();
        }
    }, [videoId]);

    const channelId = videoDetails?.snippet?.channelId;

    const fetchChannelDetails = async () => {
        if (!channelId) return; // Avoid fetching if channelId is not available

        const url = `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics%2CbrandingSettings&id=${channelId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
                'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setChannelDetails(result.items[0]);
        } catch (error) {
            console.error('Error fetching channel details:', error);
        }
    };

    useEffect(() => {
        fetchChannelDetails();
    }, [channelId]);

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen px-0 sm:px-8 lg:px-20 py-4 gap-4">
            {/* Main Video Player */}
            <div className="w-full lg:w-4/6 flex flex-col justify-center items-center rounded-xl">
                <div className='w-full'>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="sm:rounded-xl w-full aspect-video"
                    />
                    <div>
                        {videoDetails && channelDetails && (
                            <div className="mt-4 text-black dark:text-white w-full">
                                <h3 className="text-md sm:text-xl body-bold px-4 sm:px-0">{videoDetails.snippet.title}</h3>
                                <div className='hidden sm:flex justify-between'>
                                    <div className='flex items-center'>
                                        <Link href={`/channel/${videoDetails.snippet.channelId}`} className='flex gap-2 items-center py-2'>
                                            <img
                                                src={channelDetails.snippet.thumbnails.high.url}
                                                alt={`${channelDetails.snippet.channelTitle} profile`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="text-lg body-bold text-black dark:text-white px-4 sm:px-0">
                                                    {videoDetails.snippet.channelTitle}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-white px-4 sm:px-0">
                                                    {formatCount(channelDetails.statistics.subscriberCount)} subscribers
                                                </p>
                                            </div>
                                        </Link>
                                        <div className='px-4'>
                                            <Button className='rounded-full body'>Subscribe</Button>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Button variant={"videoProps"} className='rounded-full body'>
                                            <ThumbsUp /> {formatCount(videoDetails.statistics.likeCount)}
                                        </Button>
                                        <Button variant={"videoProps"} className='rounded-full body'>
                                            <ThumbsDown />
                                        </Button>
                                        <Button variant={"videoProps"} className='rounded-full body'>
                                            <ExternalLink /> Share
                                        </Button>
                                        <Button variant={"videoProps"} className='rounded-full body'>
                                            <Download /> Download
                                        </Button>
                                        <Button variant={"videoProps"} className='rounded-full body'>
                                            <Ellipsis />
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex flex-col sm:hidden justify-between gap-2'>
                                    <div className='flex items-center justify-between px-4'>
                                        <Link href={`/channel/${videoDetails.snippet.channelId}`} className='flex gap-2 items-center py-2'>
                                            <img
                                                src={channelDetails.snippet.thumbnails.high.url}
                                                alt={`${channelDetails.snippet.channelTitle} profile`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="inline-flex items-center text-md body text-black dark:text-white px-2 sm:px-0">
                                                    {videoDetails.snippet.channelTitle} <LuDot />
                                                    <span className="text-sm text-gray-500 dark:text-white body-light">
                                                        {formatCount(channelDetails.statistics.subscriberCount)}
                                                    </span>
                                                </p>
                                            </div>
                                        </Link>
                                        <div>
                                            <Button className='rounded-full body'>Subscribe</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center px-4 gap-2 rounded-md max-w-full overflow-x-auto">
                                        <div className="flex space-x-4 max-w-full">
                                            <Button variant="videoProps" className="flex-shrink-0 rounded-full body-light text-xs">
                                                <ThumbsUp /> {formatCount(videoDetails.statistics.likeCount)}
                                            </Button>
                                            <Button variant="videoProps" className="flex-shrink-0 rounded-full">
                                                <ThumbsDown />
                                            </Button>
                                            <Button variant="videoProps" className="flex-shrink-0 rounded-full body-light text-xs">
                                                <ExternalLink /> Share
                                            </Button>
                                            <Button variant="videoProps" className="flex-shrink-0 rounded-full body-light text-xs">
                                                <Download /> Download
                                            </Button>
                                            <Button variant="videoProps" className="flex-shrink-0 rounded-full">
                                                <Ellipsis />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='hidden sm:block px-4 sm:px-0 w-full'>
                    {videoDetails && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-zinc-900 rounded-xl text-black dark:text-white w-full">
                            <p className="text-md body text-gray-700 dark:text-white inline-flex items-center">
                                {videoDetails.statistics.viewCount
                                    ? `${formatCount(videoDetails.statistics.viewCount)} views · `
                                    : ''}{' '}
                                Uploaded on{' '}
                                {new Date(videoDetails.snippet.publishedAt).toLocaleDateString()} (
                                {formatDistanceToNow(parseISO(videoDetails.snippet.publishedAt), {
                                    addSuffix: true,
                                })}
                                )
                            </p>
                            <p className="mt-2 text-gray-500 dark:text-white">{videoDetails.snippet.description}</p>
                        </div>
                    )}
                </div>
                <div className='sm:hidden px-4 sm:px-0 w-full'>
                    {videoDetails && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-zinc-900 rounded-xl text-black dark:text-white w-full">
                            <p className="text-xs body text-gray-700 dark:text-white inline-flex items-center">
                                {videoDetails.statistics.viewCount
                                    ? `${formatCount(videoDetails.statistics.viewCount)} views · `
                                    : ''}{' '}
                                Uploaded on{' '}
                                {new Date(videoDetails.snippet.publishedAt).toLocaleDateString()} (
                                {formatDistanceToNow(parseISO(videoDetails.snippet.publishedAt), {
                                    addSuffix: true,
                                })}
                                )
                            </p>
                            <p className="mt-2 text-xs text-gray-500 dark:text-white">{videoDetails.snippet.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Suggested Videos */}
            <div className="w-full lg:w-2/6 flex flex-col justify-start items-start px-0 sm:px-0 gap-2">
                <h2 className="dark:text-white text-lg body-bold px-4 sm:pl-2">Suggested Videos</h2>
                {loading ? (
                    <p className="text-gray-400 sm:pl-2">Loading...</p>
                ) : (
                    <div className="flex flex-col gap-4 sm:gap-2">
                        {suggestedVideos.map((video) => (
                            <VideoCardSuggested
                                key={video.id.videoId}
                                video={video}
                                channelDetails={channelDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
