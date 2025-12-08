'use client';

import {useRouter} from "next/navigation";
import {useTranslations, useLocale} from "next-intl";
import {FaRegMap} from "react-icons/fa6";
import {MdOutlineAccessTime} from "react-icons/md";
import {HiTranslate} from "react-icons/hi";
import {VscTypeHierarchySub} from "react-icons/vsc";
import Image from "next/image";

interface Tour {
    id: number;
    image: string;
    price: number;

    [key: string]: any;
}

const Booking = ({tour}: { tour: Tour }) => {
    const router = useRouter();
    const t = useTranslations('Tours');
    const lang = useLocale();

    const stripHTML = (text?: string) => text?.replace(/<[^>]*>/g, "") || "";
    const decodeHtml = (html?: string) => {
        if (!html) return "";
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const langKey = lang === "ru"
        ? "ru"
        : lang === "tk"
            ? "tk"
            : "en";

    const title = stripHTML(tour[`title_${langKey}`]);
    const duration = stripHTML(tour[`duration_${langKey}`]);
    const destination = stripHTML(tour[`destination_${langKey}`]);
    const language = stripHTML(tour[`lang_${langKey}`]);
    const type = stripHTML(tour[`type_${langKey}`]);
    const text = stripHTML(tour[`text_${langKey}`]);

    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${tour.image.replace(/\\/g, "/")}`;

    const handleClick = () => {
        const decodedTitle = decodeHtml(tour[`title_${langKey}`]);
        router.push(`/booking?tourId=${tour.id}&tourTitle=${encodeURIComponent(decodedTitle)}`);
    };

    return (
        <div className="pt-10 xl:pt-20"
             style={{
                 backgroundImage: "url(/map.webp)",
                 backgroundRepeat: "no-repeat",
                 backgroundSize: "contain",
                 backgroundPosition: "center right",
             }}
        >
            <div className="container px-2 mx-auto">
                <section className="flex flex-col-reverse lg:flex-row py-10 lg:space-x-4">
                    <div
                        className="flex flex-col lg:w-2/3 items-center lg:items-start"
                    >
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={400}
                            height={400}
                            className="w-full rounded-2xl object-cover shadow-lg"
                        />
                        <p className="mt-6 leading-relaxed text-lg text-gray-700">{text}</p>
                    </div>

                    <div
                        className="flex flex-col pt-10 w-full lg:w-1/2 space-y-6"
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#336B7B] mb-4">{title}</h2>
                        {tour.price !== null && (
                            <p className="ml-2 font-bold text-6xl">
                                ${tour.price}{" "}
                                <span className="font-normal text-lg">
                                    {t("tours-price")}
                                </span>
                            </p>
                        )
                        }

                        <div className="w-full space-y-2">
                            <div className="bg-[#FFFCFC] py-5 px-4 rounded-xl shadow-md space-y-2">
                                <p>
                                    <FaRegMap color="#A40000" className="inline mr-2"/>
                                    {destination}
                                </p>
                                <p>
                                    <MdOutlineAccessTime color="#A40000" className="inline mr-2"/>
                                    {duration}{" "}
                                    {lang === "ru"
                                        ? "дня"
                                        : lang === "tk"
                                            ? "gün"
                                            : "days"}
                                </p>

                                <p>
                                    <HiTranslate color="#A40000" className="inline mr-2"/>
                                    {language}
                                </p>
                                <p>
                                    <VscTypeHierarchySub color="#A40000" className="inline mr-2"/>
                                    {type}
                                </p>
                            </div>

                            <button
                                onClick={handleClick}
                                className="bg-[#A40000] text-white py-3 rounded-xl hover:bg-[#525960] transition duration-200 w-full mb-5 lg:mb-0"
                            >
                                {t("tours-booking")}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Booking;
