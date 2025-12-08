'use client';

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {useTranslations, useLocale} from "next-intl";
import {FaBed, FaUtensils, FaDumbbell, FaWifi} from "react-icons/fa6";
import {MdOutlineFreeBreakfast, MdWaves} from "react-icons/md";
import {TbMassage} from "react-icons/tb";
import renderStars from "@/components/Information/renderStars";
import {LuSquareParking} from "react-icons/lu";
import {GiTennisCourt} from "react-icons/gi";

interface Hotel {
    id: number;
    rating: number;
    title_en: string;
    title_ru: string;
    title_tk: string;
    text_en: string;
    text_ru: string;
    text_tk: string;
}

interface Asset {
    id: number;
    hotel_id: number;
    icon: string;
    text_en: string;
    text_ru: string;
    text_tk: string;
}

export default function HotelData() {
    const params = useParams();
    const id = Number(params.id);
    const locale = useLocale();
    const t = useTranslations('Information');

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [hotelsRes, assetsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotel-assets`)
                ]);

                const hotelsData = await hotelsRes.json();
                const assetsData = await assetsRes.json();

                setHotels(hotelsData);
                setAssets(assetsData);
            } catch (e) {
                setError(true);
                console.error("Error fetching data:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <div className="mt-20 py-10 text-center">Loading...</div>;
    if (error) return <div className="mt-20 py-10 text-center text-red-500">Error loading data</div>;

    const hotel = hotels.find(h => h.id === id);
    if (!hotel) return <div className="mt-20 py-10 text-center">Hotel not found</div>;

    const langKey = locale === "ru" ? "ru" : locale === "tk" ? "tk" : "en";

    const getHotelField = (key: 'title' | 'text'): string => {
        const field = `${key}_${langKey}` as keyof Hotel;
        const value = hotel[field];
        return typeof value === 'string' ? value : '';
    };

    const titleHTML = getHotelField('title');  // HTML из TipTap
    const hotelTextHTML = getHotelField('text'); // HTML из TipTap

    const stripAllHTML = (html: string): string => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, "");
    };

    const safeHTML = (html: string): string => {
        if (!html) return '';
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/g, '')
            .replace(/on\w+='[^']*'/g, '')
            .replace(/on\w+=\w+/g, '');
    };

    const formatTipTapContent = (html: string, isTitle: boolean = false) => {
        if (!html) return null;

        let processedHTML = safeHTML(html);

        if (isTitle) {
            return processedHTML;
        } else {
            processedHTML = processedHTML.replace(
                /(Standart[^<]*\$[^<]*)/gi,
                '<div class="price-block"><strong class="text-red-800 text-lg">$1</strong></div>'
            );

            processedHTML = processedHTML.replace(
                /<p>/g,
                '<p class="mb-4 leading-relaxed text-gray-800">'
            );

            return processedHTML;
        }
    };

    const iconMap = {
        fabed: FaBed,
        fautensils: FaUtensils,
        fadumbbell: FaDumbbell,
        fawifi: FaWifi,
        mdwaves: MdWaves,
        tbmassage: TbMassage,
        lusquareparking: LuSquareParking,
        mdoutlinefreebreakfast: MdOutlineFreeBreakfast,
        gitenniscourt: GiTennisCourt
    };

    const hotelAssets = assets.filter(a => a.hotel_id === hotel.id);

    const getAssetText = (asset: Asset): string => {
        const field = `text_${langKey}` as keyof Asset;
        const value = asset[field];
        return typeof value === 'string' ? stripAllHTML(value) : '';
    };

    return (
        <div className="mt-20 py-10">
            <div className="container mx-auto px-4 space-y-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                    <div className="space-y-3">
                        <h1
                            className="text-2xl font-bold text-[#A40000]"
                            dangerouslySetInnerHTML={{
                                __html: formatTipTapContent(titleHTML, true) || ''
                            }}
                        />
                        <div className="flex items-center gap-2">
                            {renderStars(hotel.rating)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {hotelAssets.map(asset => {
                            const Icon = iconMap[asset.icon.toLowerCase() as keyof typeof iconMap];
                            const textAsset = getAssetText(asset);
                            return (
                                <div key={asset.id} className="flex items-center gap-2">
                                    {Icon && <Icon style={{width: "25px", height: "25px"}}/>}
                                    <p className="text-base text-gray-700">{textAsset}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-20">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-[#A40000]">{t('description')}</h2>

                        <div
                            className="hotel-description"
                            dangerouslySetInnerHTML={{
                                __html: formatTipTapContent(hotelTextHTML, false) || ''
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}