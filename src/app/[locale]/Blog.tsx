'use client'

import {useLocale, useTranslations} from "next-intl";
import {GrGroup} from "react-icons/gr";
import {FaRoute} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

interface Blog {
    id: number;
    image: string;
    title_ru?: string;
    title_en?: string;
    title_tk?: string;
    text_ru?: string;
    text_en?: string;
    text_tk?: string;
}

const Blog = () =>{
    const t = useTranslations('Blog')
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const lang = useLocale();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
                if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
                const data = await res.json();
                setBlogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const stripHTML = (text: string) => text?.replace(/<[^>]*>/g, '') || '';

    const getField = (item: Blog, field: 'title' | 'text') => {
        if (lang === 'ru') return stripHTML(item[`${field}_ru`] || '');
        if (lang === 'tk') return stripHTML(item[`${field}_tk`] || '');
        return stripHTML(item[`${field}_en`] || '');
    };

    if (error)
        return (
            <p className="text-center text-red-500 py-10">
                {t('error')}: {error}
            </p>
        );
    if (blogs.length === 0) return null;

    const latestBlogs = blogs.slice(-4).reverse();
    const bigBlog = latestBlogs[0];
    const smallBlogs = latestBlogs.slice(1);
    const bigTitle = getField(bigBlog, 'title');
    const bigText = getField(bigBlog, 'text');
    const bigImage = `${process.env.NEXT_PUBLIC_API_URL}/${bigBlog.image}`;

    return (
        <div className="container mx-auto px-4">
            <div className="w-full mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <div>
                            <h3 className="text-3xl lg:text-5xl font-semibold mb-2">
                                {t("why-we")}
                            </h3>
                            <div className="h-[2px] flex-1 bg-[#A40000] my-2 md:my-5"></div>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-semibold">
                                {t("why-text")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-8 mt-4">
                            <div className="flex items-start gap-4">
                                <GrGroup className="h-8 w-8 mt-1 text-red-800"/>
                                <div>
                                    <h4 className="font-semibold text-lg">
                                        {t("why-team")}
                                    </h4>
                                    <p className="text-gray-700 text-sm md:text-base">
                                        {t("why-experience")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FaRoute className="h-8 w-8 mt-1 text-red-800"/>
                                <div>
                                    <h4 className="font-semibold text-lg">
                                        {t("why-route")}
                                    </h4>
                                    <p className="text-gray-700 text-sm md:text-base">
                                        {t("why-rhythm")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-2/3 lg:flex justify-center lg:justify-end hidden"
                    >
                        <Image
                            src="/awaza.webp"
                            alt="why we"
                            width={400}
                            height={400}
                            className="w-full rounded-md"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col relative items-center my-20 xl:mt-20 xl:mb-56">
                <div className="absolute -top-[52px] z-0">
                    <Image
                        src="/compas.webp"
                        alt="compas"
                        width={500}
                        height={500}
                        className="rotateImg w-70 lg:w-full max-w-full"
                    />
                </div>

                <div className="flex flex-col items-center mb-6 relative z-10">
                    <h1 className="text-center text-2xl lg:text-5xl lg:py-5 font-bold uppercase">
                        {t('blog-title')}
                    </h1>
                    <p className="max-w-xl mx-auto text-center lg:py-5">
                        {t('blog-text')}
                    </p>
                    <Link
                        href="/blogs"
                        className="bg-[#A40000] text-white text-sm font-semibold px-8 py-2 rounded-md w-fit uppercase"
                    >
                        {t('blog-main-button')}
                    </Link>
                </div>

                <div className="w-full relative z-2 mx-auto px-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="flex flex-col text-start items-start rounded-xl overflow-hidden">
                            <Link href={`/blog/${bigBlog.id}`} className="w-full">
                                <Image
                                    src={bigImage}
                                    alt={bigTitle}
                                    width={400}
                                    height={400}
                                    unoptimized
                                    className="w-full object-cover"
                                />
                            </Link>
                            <div className="flex py-6 flex-col items-start gap-4 flex-1 w-full">
                                <div className="w-full">
                                    <h2 className="text-md xl:text-2xl font-bold">{bigTitle}</h2>
                                    <p className="text-gray-700 text-sm xl:text-lg w-full line-clamp-4 font-medium">
                                        {bigText}
                                    </p>
                                </div>
                                <div className="flex justify-center w-full lg:justify-start">
                                    <Link
                                        href={`/blogs/${bigBlog.id}`}
                                        className="bg-red-800 cursor-pointer mt-2 text-white text-sm font-semibold px-10 py-2 rounded-lg w-fit uppercase"
                                    >
                                        {t('blog-button')}
                                    </Link>
                                </div>

                            </div>
                        </div>

                        <div className="flex flex-col gap-10">
                            {smallBlogs.map((blog) => {
                                const title = getField(blog, 'title');
                                const text = getField(blog, 'text');
                                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${blog.image}`;

                                return (
                                    <div
                                        key={blog.id}
                                        className="flex flex-col xl:flex-row space-x-2 h-auto xl:h-44"
                                    >
                                        <Link href={`/blog/${blog.id}`}>
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                width={400}
                                                height={400}
                                                className="w-full object-cover xl:w-56"
                                            />
                                        </Link>
                                        <div className="flex flex-col justify-between lg:px-5 flex-1">
                                            <div>
                                                <h3 className="text-md md:text-xl font-bold mb-2">{title}</h3>
                                                <p className="text-sm text-gray-700 line-clamp-4 font-medium">
                                                    {text}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/blogs/${blog.id}`}
                                                className="bg-red-800 cursor-pointer mx-auto mt-2 text-white text-sm font-semibold px-10 py-2 rounded-lg w-fit uppercase"
                                            >
                                                {t('blog-button')}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog