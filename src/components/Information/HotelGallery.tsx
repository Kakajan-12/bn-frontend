'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface Hotel {
    id: number;
    [key: string]: any;
}

interface GalleryItem {
    id: number;
    hotel_id: number;
    image: string;
}

interface GalleryProps {
    hotel: Hotel;
}

const HotelGallery: React.FC<GalleryProps> = ({ hotel }) => {
    const hotelId = hotel.id;
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotel-gallery`);
                if (!res.ok) throw new Error("Ошибка загрузки галереи");

                const data: GalleryItem[] = await res.json();
                setImages(data.filter(item => item.hotel_id === hotelId));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [hotelId]);
    if (!images.length) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-500">
                no images
            </div>
        );
    }
    return (
        <div className="space-y-4 p-3">
            <div className="w-full mx-auto py-6">
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {images.map((item, index) => (
                        <div
                            key={index}
                            className="mb-4 break-inside-avoid rounded-md overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image}`}
                                alt={`gallery-${index}`}
                                width={400}
                                height={400}
                                className="rounded-lg w-full h-auto object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HotelGallery;
