'use client';

import React, {useState, useEffect} from "react";
import {useTranslations, useLocale} from "next-intl";
import RouteAccordion from "@/components/ui/accordion";

interface Itinerary {
    id: number;
    tour_id: number;
    title_ru: string;
    title_en: string;
    title_tk: string;
    text_ru: string;
    text_en: string;
    text_tk: string;
}

interface RouteProps {
    tour: {
        id: number;
    };
}

export default function Route({tour}: RouteProps) {
    const t = useTranslations("Tours");
    const lang = useLocale();
    const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

    const [data, setData] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/itinerary`);
                if (!res.ok) throw new Error("Ошибка загрузки данных");
                const result: Itinerary[] = await res.json();
                setData(result.filter((item) => item.tour_id === tour.id));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tour.id]);

    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!data.length) return null;

    const stripHTML = (text: string) => text?.replace(/<[^>]*>/g, "") || "";

    // безопасно мапим поля в зависимости от языка
    const langSuffix = lang === "ru" || lang === "rus" ? "ru" : lang === "tk" || lang === "tkm" ? "tk" : "en";

    const accordionData = data.map((item) => ({
        id: item.id,
        title: stripHTML(item[`title_${langSuffix}` as keyof Itinerary] as string),
        text: stripHTML(item[`text_${langSuffix}` as keyof Itinerary] as string),
    }));

    return (
        <div
            className="container mx-auto px-4">
            <div
                className="flex flex-col overflow-hidden bg-[url('/mobile-map.webp')] bg-no-repeat bg-contain bg-right">
                <div className="w-fit scrollbar-hide">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-6 text-left">
                        {t("tours-route")}
                    </h2>
                    <RouteAccordion data={accordionData} />
                </div>
            </div>

        </div>
    );
}
