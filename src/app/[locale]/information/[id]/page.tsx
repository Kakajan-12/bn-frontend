'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HotelGallery from "@/components/Information/HotelGallery";
import HotelData from "@/components/Information/HotelData";

interface Hotel {
    id: number;
    image: string;
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
    rating: number;
    "location_tk": string;
    "location_en": string;
    "location_ru": string;
}

const HotelDetail =()=>{
    const params = useParams();
    const id = params?.id;
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${id}`);
                if (!res.ok) throw new Error("Ошибка загрузки");
                const data = await res.json();
                setHotel(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTour();
    }, [id]);
    return(
        <div className="container mx-auto px-4">
            <HotelData/>
            {hotel && <HotelGallery hotel={hotel} />}
        </div>
    )
}

export default HotelDetail