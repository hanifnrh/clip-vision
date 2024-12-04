'use client';

import { Dots } from '@/components/ui/dots';
import VideoCard from '@/components/ui/videocard';
import { useEffect, useState } from 'react';

type VideoItem = {
  id: { videoId: string };
  snippet: { channelId: string };
};

type ChannelDetails = {
  id: string;
  snippet: Record<string, any>;
  statistics: Record<string, any>;
};

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [channels, setChannels] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVideos = async () => {
    const videoUrl =
      'https://youtube-v31.p.rapidapi.com/search?relatedToVideoId=KREKSUPia3k&part=id%2Csnippet&type=video&maxResults=50';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'efa326abc6mshb0cdb1f33157ceep1f924fjsn15ea53e1a274',
        'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(videoUrl, options);
      const result = await response.json();

      // Pastikan semua data memiliki tipe yang benar
      const videoItems: VideoItem[] = result.items;

      setVideos(videoItems);

      const channelIds = [...new Set(videoItems.map((item) => item.snippet.channelId))];

      const channelData: Record<string, ChannelDetails> = {};
      for (const channelId of channelIds) {
        if (typeof channelId !== 'string') continue; // Validasi tipe

        const channelUrl = `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics&id=${channelId}`;
        const channelResponse = await fetch(channelUrl, options);
        const channelResult = await channelResponse.json();
        channelData[channelId] = channelResult.items[0];
      }

      setChannels(channelData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen pb-20 gap-16 px-0 sm:px-8 lg:px-20 py-4">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Dots />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id.videoId}
                video={video}
                channel={channels[video.snippet.channelId as string]} // Casting aman
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
