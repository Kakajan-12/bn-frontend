'use client';

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Blog } from "@/types/blog";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Share from "yet-another-react-lightbox/plugins/share";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Image from "next/image";


const BlogDetail = () => {
    const { id } = useParams();
    const lang = useLocale();
    const zoomRef = useRef(null);
    const captionsRef = useRef(null);
    const [gallery, setGallery] = useState<any[]>([]);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<number | false>(false);

    useEffect(() => {
        if (!id) return;

        async function fetchBlog() {
            try {
                const [blogRes, galleryRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog-gallery`),
                ]);
                const blogData = await blogRes.json();
                const galleryData = await galleryRes.json();

                setBlog(blogData[0]);
                setGallery(galleryData.filter((item: any) => item.blog_id === Number(id)));
            } catch (err) {
                console.error("Ошибка загрузки блога:", err);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        }

        fetchBlog();
    }, [id]);

    if (loading) return <p className="text-center py-20">Загрузка...</p>;
    if (!blog) return <p className="text-center py-20">Блог не найден</p>;

    const title = blog[`title_${lang}` as keyof Blog] as string;
    const text = blog[`text_${lang}` as keyof Blog] as string;

    return (
        <div>
            <div
                className="relative w-full bg-cover bg-center text-white"
                style={{backgroundImage: "url('/desertBg.webp')"}}
            >
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="flex flex-col justify-center space-y-6 lg:text-start h-[600px]">
                        <h2
                            className="text-xl md:text-2xl xl:text-3xl max-w-5xl font-bold drop-shadow-md"
                            dangerouslySetInnerHTML={{__html: title}}
                        />
                        <p className="text-sm md:text-md opacity-80 mt-2">
                            {new Date(blog.date).toLocaleDateString(
                                lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "tk-TM"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-2">
                <div className="space-y-6 w-full pt-4 pb-44">
                    <div
                        className="text-xs sm:text-md lg:text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{__html: text}}
                    />

                    {gallery.length === 0 ? (
                        <p className="text-center opacity-70">Нет изображений</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center gap-5">
                            {gallery.map((img, index) => {
                                const imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/${img.image.replace(/\\/g, "/")}`;
                                return (
                                    <Image
                                        key={img.id}
                                        onClick={() => setOpen(index)}
                                        src={imgUrl}
                                        width={500}
                                        height={500}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full rounded-md shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
                                    />
                                );
                            })}
                        </div>
                    )}

                    <Lightbox
                        open={open !== false}
                        close={() => setOpen(false)}
                        index={open === false ? 0 : open}
                        plugins={[Zoom, Captions, Download, Share]}
                        zoom={{ref: zoomRef}}
                        captions={{ref: captionsRef}}
                        slides={gallery.map((img) => ({
                            src: `${process.env.NEXT_PUBLIC_API_URL}/${img.image.replace(/\\/g, "/")}`,
                        }))}
                    />
                </div>
            </div>
        </div>

    );
};

export default BlogDetail;
