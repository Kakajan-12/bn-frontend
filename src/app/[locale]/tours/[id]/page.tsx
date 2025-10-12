'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Booking from "@/components/TourPerPage/Booking";
import Route from "@/components/TourPerPage/Route";
import Includes from "@/components/TourPerPage/Includes";
import Gallery from "@/components/TourPerPage/Gallery";

interface Tour {
    id: number;
    title_en: string;
    title_ru: string;
    title_tk: string;
    price: number;
    image: string;
    duration_en: string;
    duration_ru: string;
    duration_tk: string;
    [key: string]: any;
}

const TourPage = () => {
    const params = useParams();
    const id = params?.id;
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`);
                if (!res.ok) throw new Error("Ошибка загрузки тура");
                const data = await res.json();
                setTour(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTour();
    }, [id]);

    if (loading) return <p className="text-center py-10">Загрузка...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!tour) return null;

    return (
        <div className="space-y-12">
            <Booking tour={tour} />
            <Route tour={tour} />
            <Includes tour={tour}/>
            <Gallery tour={tour}/>
        </div>
    );
};

export default TourPage;
