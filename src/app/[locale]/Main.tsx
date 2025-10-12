'use client'

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import {useLocale} from "next-intl";

const Main = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sliders`);
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                const data = await response.json();
                setSlides(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const getLocalized = (slide: any, field: "title" | "text") =>
        slide[`${field}_${locale}`] || slide[`${field}_en`] || slide[`${field}_tk`] || "";

    const getFixedImageUrl = (path: string) => {
        if (!path) return "";
        return (
            process.env.NEXT_PUBLIC_API_URL!.replace(/\/+$/, "") +
            "/" +
            path.replace(/\\/g, "/").replace(/^(\.\.\/)+/, "").replace(/^\/+/, "")
        );
    };


    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    if (loading) return <div className="text-center py-10">Загрузка...</div>;
    if (error) return <div className="text-center text-red-500 py-10">Ошибка: {error}</div>;


    return (
        <div className="relative w-full h-screen">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="h-full"
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="w-full h-full relative bg-cover bg-center flex justify-center items-center"
                            style={{ backgroundImage: `url(${getFixedImageUrl(slide.image)})` }}
                        >
                            <div className="absolute inset-0 bg-black/50"></div>

                            <div className="relative z-10 text-center text-white container px-4">
                                <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
                                    {stripHtml(getLocalized(slide, "title"))}
                                </h1>
                                <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
                                    {stripHtml(getLocalized(slide, "text"))}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-8 w-full flex justify-center">
                <div className="swiper-pagination"></div>
            </div>
        </div>
    );
};

export default Main;
