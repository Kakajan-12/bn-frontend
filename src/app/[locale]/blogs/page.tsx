'use client';

import { useEffect, useState } from "react";
import {useLocale, useTranslations} from "next-intl";
import BlogFilter from "@/components/Blogs/Filter";
import {Blog} from "@/types/blog"
import BlogList from "@/components/Blogs/BlogList";

export default function Blogs() {
    const t = useTranslations('Blog');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const locale = useLocale();


    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
                const data = await res.json();
                setBlogs(data);
                setFilteredBlogs(data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    return (
        <div>
            <div
                className="bg-no-repeat relative w-full bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/desertBg.webp')" }}
            >
                <div className="container mx-auto px-2 flex flex-col h-[500px] justify-center space-y-5">
                    <h1 className="text-3xl lg:text-6xl font-semibold">{t('title')}</h1>
                    <p className="lg:text-lg">{t('text')}</p>
                </div>
            </div>

            <div className="container mx-auto px-2">
                <div className="flex justify-center w-full relative -top-20">
                    <div className="border-b border-black py-10 px-7 max-w-4xl bg-white space-y-3">
                        <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">{t('card-title')}</h2>
                        <p className="text-center text-sm md:text-md">
                            {t('card-text')}
                        </p>
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    <BlogFilter
                        blogs={blogs}
                        setFilteredBlogs={setFilteredBlogs}
                        setCurrentPage={setCurrentPage}/>

                    <BlogList
                        lang={locale}
                        blogs={filteredBlogs}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
