"use client";
import { Button } from '@/components/ui/button';
import { Dots } from '@/components/ui/dots';
import VideoCard from '@/components/ui/videocard';
import { useEffect, useState } from 'react';
import { LuDot } from 'react-icons/lu';

const ChannelDetail = () => {
    const [channelDetails, setChannelDetails] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    function formatSubscriberCount(count: number): string {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    useEffect(() => {

        const fetchChannelDetails = async () => {
            const url = `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics%2CbrandingSettings&id=UC74PZw53jrvgb_wt3VkcMiw`;
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

        fetchChannelDetails();
    },);

    useEffect(() => {
        const fetchVideos = async () => {
            const url = `https://youtube-v31.p.rapidapi.com/search?channelId=UC74PZw53jrvgb_wt3VkcMiw&part=snippet%2Cid&order=date&maxResults=50`;
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
                setVideos(result.items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setLoading(false);
            }
        };

        fetchVideos();
    },);

    if (!channelDetails) {
        return (
            <div className="flex items-center justify-center h-screen px-0 sm:px-8 lg:px-20 py-4">
                <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
                    <div className="flex justify-center items-center w-full h-full">
                        <Dots />
                    </div>
                </div>
            </div>
        );
    }

    const {
        snippet: { title, description, thumbnails, customUrl },
        statistics: { subscriberCount, viewCount, videoCount },
        brandingSettings: { image: { bannerExternalUrl } }
    } = channelDetails;

    return (
        <div className="flex items-center justify-center min-h-screen pb-20 gap-16 px-0 sm:px-8 lg:px-20 py-4">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                {/* Channel Banner */}
                <div className='w-full h-32 sm:h-60 px-4'>
                    {bannerExternalUrl && (
                        <div className="w-full h-full sm:h-60 bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${bannerExternalUrl})` }}>
                        </div>
                    )}
                </div>

                <div className="flex w-full justify-start sm:mt-4 px-4">
                    {/* Profile Picture */}
                    <div className="hidden sm:flex items-center">
                        <img
                            src={thumbnails?.high?.url}
                            alt={`${title} profile`}
                            className="w-20 h-20 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg"
                        />
                        <div className="grid ml-4 gap-2 grid-cols-1">
                            <h1 className="text-xl sm:text-4xl body-bold">{title}</h1>
                            <p className='inline-flex items-center body'>{customUrl} <LuDot /> {formatSubscriberCount(subscriberCount)} subscribers <LuDot /> {videoCount} videos</p>
                            <p className="text-sm text-gray-500 body-light dark:text-white">{description}</p>
                            <div>
                                <Button className='rounded-full body'>Subscribe</Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col sm:hidden items-center">
                        <div className='flex w-full'>
                            <img
                                src={thumbnails?.high?.url}
                                alt={`${title} profile`}
                                className="w-20 h-20 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="ml-4 gap-1 grid grid-cols-1 sm:hidden">
                                <h1 className="text-xl sm:text-4xl body-bold">{title}</h1>
                                <p className='inline-flex items-center body-light text-gray-500 text-sm'>{customUrl}</p>
                                <p className='inline-flex items-center body-light text-gray-500 text-sm'>{formatSubscriberCount(subscriberCount)} subscribers <LuDot /> {videoCount} videos</p>
                            </div>
                        </div>
                        <p className="w-full py-4 text-sm text-gray-500 body-light dark:text-white">{description}</p>
                        <Button className='w-full rounded-full body'>Subscribe</Button>
                    </div>
                </div>

                {/* Displaying Videos */}
                <div className="mt-8">
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <Dots />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {videos.map((video: any, index: number) => (
                                <VideoCard
                                    key={video.id.videoId || index}  // Use videoId if available, else fallback to index
                                    video={video}
                                    channel={channelDetails} // Casting aman
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ChannelDetail;
