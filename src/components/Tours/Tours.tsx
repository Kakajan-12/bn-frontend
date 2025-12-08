'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PiCurrencyDollarBold } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import {Tour} from "@/types/tour"
import {useTranslations} from "next-intl";

interface ToursProps {
    tours: Tour[];
    loading: boolean;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    lang: string;
}

const Tours: React.FC<ToursProps> = ({ tours, loading, currentPage, setCurrentPage, lang }) => {
    const t = useTranslations("Pagination")
    const [itemsPerPage] = useState(6);
    const topRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (topRef.current) {
            const offset = 100;
            const elementPosition = topRef.current.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }, [currentPage]);

    if (loading) {
        return <p className="text-center py-10 text-gray-500">Loading tours...</p>;
    }

    const totalPages = Math.ceil(tours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTours = tours.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="space-y-10">
            <div ref={topRef} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentTours.map((item) => {
                    const title = item[`title_${lang}` as keyof Tour] as string;
                    const duration = item[`duration_${lang}` as keyof Tour];
                    const type = item[`type_${lang}` as keyof Tour];
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${item.image}`;

                    return (
                        <Link key={item.id} href={`/tours/${item.id}`} className="group">
                            <div className="border border-red-600 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 bg-white overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={title.replace(/<\/?[^>]+(>|$)/g, "")}
                                    width={400}
                                    height={250}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="px-6 py-5 space-y-4 text-gray-800">
                                    <p
                                        className="text-md sm:text-lg font-semibold line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: title }}
                                    />
                                    <div className="h-px w-full bg-gray-200"></div>
                                    <div className="flex flex-col items-start text-md font-medium space-y-2">
                                        {item.price !== null && (
                                            <p className="flex items-center gap-2">
                                                <PiCurrencyDollarBold className="text-[#A40000]" />
                                                {item.price}
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2">
                                            <FaRegCalendarAlt className="text-[#A40000]"/>
                                            {duration} {lang === "ru" ? "дн." : lang === "tk" ? "gün" : "days"}
                                        </p>
                                        <p className="flex items-center gap-2 text-sm text-gray-600">
                                            <IoPersonOutline className="text-[#A40000]" />
                                            {type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border ${
                            currentPage === 1
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-[#A40000] text-[#A40000] hover:bg-[#A40000] hover:text-white transition"
                        }`}
                    >
                        {t('prev')}
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                                    currentPage === index + 1
                                        ? "bg-[#A40000] text-white border-[#A40000]"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border ${
                            currentPage === totalPages
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-[#A40000] text-[#A40000] hover:bg-[#A40000] hover:text-white transition"
                        }`}
                    >
                        {t('next')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tours;
