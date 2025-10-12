'use client';

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Tour {
    id: number;
    [key: string]: any;
}

interface GalleryItem {
    id: number;
    tour_id: number;
    image: string;
}

interface GalleryProps {
    tour: Tour;
}

const Gallery: React.FC<GalleryProps> = ({ tour }) => {
    const t = useTranslations("Information");
    const tourId = tour.id;

    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-gallery`);
                if (!res.ok) throw new Error("Ошибка загрузки галереи");

                const data: GalleryItem[] = await res.json();
                setImages(data.filter(item => item.tour_id === tourId));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [tourId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) return <div className="text-center text-red-500">{error}</div>;

    if (!images.length) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-500">
                {t("no-images")}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col">
                <h3 className="text-[#A40000] text-3xl md:text-5xl font-semibold">
                    {t("gallery")}
                </h3>

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
        </div>
    );
};

export default Gallery;
