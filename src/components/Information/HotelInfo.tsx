'use client';

import {useEffect, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface Hotel {
    id: number;
    "image": string;
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

export default function HotelInfo() {
    const t = useTranslations('Information')
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const lang = useLocale();

    useEffect(() => {
        async function fetchVisa() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels`);
                const data = await res.json();
                setHotels(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchVisa();
    }, []);

    if (loading) return <p className="text-center py-10">Загрузка...</p>;
    if (!hotels.length) return <p className="text-center py-10">Нет данных</p>;

    return (
        <div className="max-w-6xl mx-auto mt-10 space-y-4 border border-[#B1AFAF] p-3 rounded-lg">
            <div
                className="text-center font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl pt-2">{t('hotel-title')}</div>
            {hotels.map((hotel) => {
                const title = hotel[`title_${lang}` as keyof Hotel] as string;
                const text = hotel[`text_${lang}` as keyof Hotel] as string;
                const location = hotel[`location_${lang}` as keyof Hotel] as string;
                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${hotel.image.replace(/\\/g, "/")}`;


                return (

                    <div
                        key={hotel.id}
                        className="border border-gray-300 rounded-lg bg-white flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="w-full md:w-1/3">
                            <Image
                                src={imageUrl}
                                alt={imageUrl}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col justify-between py-3 px-4 w-full md:w-2/3">
                            <div>
                                <h6
                                    className="font-semibold text-base md:text-lg mb-1"
                                    dangerouslySetInnerHTML={{__html: title}}
                                />
                                <p className="text-sm text-gray-500">{location}</p>
                            </div>

                            <div className="flex-1 mt-3">
                                <p
                                    className="text-gray-700 text-sm md:text-base font-light leading-relaxed line-clamp-3"
                                    dangerouslySetInnerHTML={{__html: text}}
                                />
                            </div>

                            <div className="flex justify-end mt-3">
                                <Link
                                    className="flex items-center text-red-600 font-medium hover:underline"
                                    href={`/information/${hotel.id}`}
                                >
                                    {t("view")} <FaArrowRight className="ml-2"/>
                                </Link>
                            </div>
                        </div>
                    </div>

                );
            })}
        </div>
    );
}
