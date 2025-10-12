'use client';

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

interface Visa {
    id: number;
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
}

export default function VisaInfo() {
    const [visas, setVisas] = useState<Visa[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<number | null>(null);
    const lang = useLocale();

    useEffect(() => {
        async function fetchVisa() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visa`);
                const data = await res.json();
                setVisas(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchVisa();
    }, []);

    if (loading) return <p className="text-center py-10">Загрузка...</p>;
    if (!visas.length) return <p className="text-center py-10">Нет данных</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-4">
            {visas.map((visa) => {
                const title = visa[`title_${lang}` as keyof Visa] as string;
                const text = visa[`text_${lang}` as keyof Visa] as string;
                const isOpen = openId === visa.id;

                return (
                    <div
                        key={visa.id}
                        className="border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden"
                    >
                        {/* Заголовок */}
                        <button
                            onClick={() => setOpenId(isOpen ? null : visa.id)}
                            className="w-full flex justify-between items-center px-6 py-4 text-left"
                        >
                            <div
                                className="text-lg sm:text-xl font-bold text-gray-900"
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                            <IoIosArrowDown
                                size={24}
                                className={`text-gray-700 transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Контент */}
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-200 px-6 py-4 bg-gray-50"
                                >
                                    <div
                                        className="text-gray-700 text-base leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: text }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
