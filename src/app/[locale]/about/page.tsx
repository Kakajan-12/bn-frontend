'use client';

import {useTranslations} from "next-intl";
import Image from "next/image";
import {MdTravelExplore} from "react-icons/md";
import {RiHotelFill} from "react-icons/ri";
import {IoCarSportSharp} from "react-icons/io5";
import {HiOutlineUserGroup} from "react-icons/hi";
import {FaPassport, FaCalendarAlt} from "react-icons/fa";

export default function About() {
    const t = useTranslations("About");

    const services = [
        {
            icon: MdTravelExplore,
            title: t('service-1-title'),
            text: t('service-1-text'),
        },
        {
            icon: RiHotelFill,
            title: t('service-2-title'),
            text: t('service-2-text'),
        },
        {
            icon: IoCarSportSharp,
            title: t('service-3-title'),
            text: t('service-3-text'),
        },
        {
            icon: HiOutlineUserGroup,
            title: t('service-4-title'),
            text: t('service-4-text'),
        },
        {
            icon: FaPassport,
            title: t('service-5-title'),
            text: t('service-5-text'),
        },
        {
            icon: FaCalendarAlt,
            title: t('service-6-title'),
            text: t('service-6-text'),
        }
    ];

    const features = [
        {
            icon: '/talent.svg',
            title: t('why-choose-1-title'),
            text: t('why-choose-1-text'),
        },
        {
            icon: '/flight.svg',
            title: t('why-choose-2-title'),
            text: t('why-choose-2-text'),
        },
        {
            icon: '/route.svg',
            title: t('why-choose-3-title'),
            text: t('why-choose-3-text'),
        },
        {
            icon: '/small_group.svg',
            title: t('why-choose-4-title'),
            text: t('why-choose-4-text'),
        }
    ];

    return (
        <div>
            <div
                className="relative w-full h-80 lg:h-[600px] bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
                style={{backgroundImage: "url('/desertBg.webp')"}}
            >
                <div className="absolute inset-0 bg-black/40 z-0"/>

                <h1
                    className="relative z-10 text-3xl sm:text-5xl md:text-7xl font-bold italic px-6 sm:px-20 leading-tight drop-shadow-lg text-center"
                >
                    {t("title")}
                </h1>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-10 pt-10 bg-white">
                    <div
                        className="xl:max-w-xl space-y-6"
                    >
                        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                            {t("sub-title")}
                        </h1>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            {t("sub-text")}
                        </p>
                    </div>

                    <div className="hidden sm:grid grid-cols-3 gap-4 w-full max-w-2xl relative pt-20">
                        <Image
                            src="/about1.webp"
                            alt="Фото 1"
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md"
                        />
                        <div>
                            <Image
                                src="/about2.webp"
                                alt="Фото 2"
                                width={400}
                                height={400}
                                className="rounded-xl shadow-md -mt-20"
                            />
                        </div>
                        <Image
                            src="/about3.webp"
                            alt="Фото 3"
                            width={400}
                            height={400}
                            className="rounded-xl shadow-md"
                        />
                    </div>
                </div>
                <div
                    className="text-center py-10 space-y-10 lg:bg-[url('/mobile-map.webp')] bg-no-repeat bg-center bg-cover"
                >
                    <h2
                        className="text-4xl lg:text-6xl font-bold"
                    >
                        {t("service-title")}
                    </h2>

                    <p
                        className="max-w-3xl lg:text-lg text-base text-gray-700 mx-auto"
                    >
                        {t("service-text")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center px-4"
                            >
                                <service.icon className="w-16 h-16 mb-4"/>
                                <p className="font-bold text-2xl mb-2">{service.title}</p>
                                <p className="max-w-xs text-lg text-gray-600">{service.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div
                className="relative bg-cover bg-center text-white text-center min-h-[300px] lg:min-h-[500px] flex items-center justify-center px-6 lg:px-40 py-20"
                style={{backgroundImage: "url('/surf.webp')"}}
            >
                <div className="absolute inset-0 bg-black/10 z-0"/>

                <div
                    className="relative z-10 space-y-6 max-w-4xl"
                >
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {t('parallax-title')}
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-gray-200">
                        {t('parallax-text')}
                    </p>
                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-10 py-15">
                    <div
                        className="lg:w-1/2 space-y-5 lg:space-y-10"
                        style={{
                            backgroundImage: "url('/compas.webp')",
                            backgroundSize: "cover",
                            backgroundPosition:"center"
                        }}
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl max-w-sm font-bold">{t('why-choose-title')}</h1>
                        <p className="text-md max-w-md text-gray-700">{t('why-choose-text')}</p>
                    </div>

                    <div className="lg:w-1/2 space-y-6 md:space-y-10">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start text-[#333333] gap-4"
                            >
                                <Image src={item.icon} alt={item.title}
                                       width={70}
                                       height={70} className="w-14 md:w-18"/>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-xl md:text-2xl">{item.title}</p>
                                    <p className="max-w-sm text-sm md:text-md">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

    );
}
