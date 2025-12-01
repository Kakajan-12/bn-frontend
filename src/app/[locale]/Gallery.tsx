'use client'

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from "next/image";

interface VideoData {
    id: number;
    video: string;
}

interface GalleryItem {
    id: number;
    image: string;
    is_gallery: number;
}

interface ImageItem {
    key: string;
    image: string;
    height: number;
}

const Gallery = () => {
    const t = useTranslations('Gallery');
    const [video, setVideo] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/video`);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                const data: VideoData[] = await response.json();
                if (data.length > 0) {
                    const videoUrl = `${process.env.NEXT_PUBLIC_API_URL!.replace(/\/+$/, "")}/${data[0].video.replace(/^\/+/, "")}`;
                    setVideo(videoUrl);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogRes, tourRes] = await Promise.all([
                    axios.get<GalleryItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/blog-gallery`),
                    axios.get<GalleryItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-gallery`),
                ]);

                const blogImages = blogRes.data.filter((item: GalleryItem) => item.is_gallery === 1);
                const tourImages = tourRes.data.filter((item: GalleryItem) => item.is_gallery === 1);

                const allImages: ImageItem[] = [
                    ...blogImages.map((item: GalleryItem) => ({
                        key: `blog-${item.id}`,
                        image: `${process.env.NEXT_PUBLIC_API_URL}/${item.image.replace(/\\/g, "/")}`,
                        height: 150 + Math.floor(Math.random() * 150),
                    })),
                    ...tourImages.map((item: GalleryItem) => ({
                        key: `tour-${item.id}`,
                        image: `${process.env.NEXT_PUBLIC_API_URL}/${item.image.replace(/\\/g, "/")}`,
                        height: 150 + Math.floor(Math.random() * 150),
                    })),
                ];

                setImages(allImages);
            } catch (error) {
                console.error("Ошибка загрузки галереи:", error);
            }
        };

        fetchData();
    }, []);

    if (error) return <div className="text-center text-red-500 py-10">{t('error')}: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="border-t border-[#A40000] w-full"></div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('gallery')}</div>
                <div className="border-t border-[#A40000] w-full"></div>
            </div>

            <div className="hidden md:flex justify-center text-center mb-8 w-full">
                <p className="max-w-xl md:max-w-2xl text-md md:text-lg">{t('gallery-text')}</p>
            </div>

            {video && (
                <div className="flex justify-center mb-10">
                    <video
                        src={video}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="shadow-lg w-full max-w-7xl"
                    />
                </div>
            )}

            <div className="w-full max-w-6xl mx-auto px-4 py-6">
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {images.map((item) => (
                        <div
                            key={item.key}
                            className="mb-4 break-inside-avoid rounded-md overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={item.image}
                                alt="gallery"
                                width={300}
                                height={400}
                                className="w-full object-cover rounded-md transition-transform duration-300 hover:scale-105"
                                style={{ height: `${item.height}px` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
