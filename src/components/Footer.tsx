'use client';

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FaLinkedin, FaTelegram, FaWhatsapp, FaPhoneSquareAlt } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";
import { FaXTwitter, FaTiktok  } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";

interface Location {
    id: number;
    location_ru: string;
    location_tk: string;
    location_en: string;
}

interface Phone {
    id: number;
    number: string;
    location_id_real: number;
}

interface Mail {
    id: number;
    mail: string;
    location_id_real: number;
}

interface Messenger {
    id: number;
    icon: string;
    url: string;
}

const Footer = () => {
    const t = useTranslations("Footer");
    const h =useTranslations("Header")
    const locale = useLocale();

    const [locations, setLocations] = useState<Location[]>([]);
    const [phones, setPhones] = useState<Phone[]>([]);
    const [mails, setMails] = useState<Mail[]>([]);
    const [messengers, setMessengers] = useState<Messenger[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";

                const [resLoc, resPhone, resMail, resMess] = await Promise.all([
                    fetch(`${base}/api/contact-location`),
                    fetch(`${base}/api/contact-numbers`),
                    fetch(`${base}/api/contact-mails`),
                    fetch(`${base}/api/links`),
                ]);

                const [locData, phoneData, mailData, messData] = await Promise.all([
                    resLoc.json(),
                    resPhone.json(),
                    resMail.json(),
                    resMess.json(),
                ]);

                if (Array.isArray(locData)) setLocations(locData);
                if (Array.isArray(phoneData)) setPhones(phoneData);
                if (Array.isArray(mailData)) setMails(mailData);
                if (Array.isArray(messData)) setMessengers(messData);
            } catch (err) {
                console.error("Ошибка при загрузке контактов:", err);
            }
        };

        fetchContacts();
    }, [locale]);

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    const renderMessengerIcons = () =>
        messengers.map((item) => {
            const iconType = item.icon?.toLowerCase();
            const icons: Record<string, React.ElementType> = {
                telegram: FaTelegram,
                linkedin: FaLinkedin,
                instagram: GrInstagram,
                whatsapp: FaWhatsapp,
                facebook: FiFacebook,
                twitter: FaXTwitter,
                tiktok: FaTiktok
            };

            const Icon = icons[iconType];
            if (!Icon) return null;

            return (
                <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                >
                    <Icon className="w-6 h-6" />
                </a>
            );
        });

    return (
        <div className="relative w-full main-background pt-8 mt-24">
            <div
                style={{
                    backgroundImage: `url("/footer.webp")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "bottom",
                }}
            >
                <div className="container relative mx-auto px-4">
                    <div className="absolute z-0 -top-30 md:-top-40 left-0">
                        <Image
                            src="/redmap.webp"
                            alt="Red Map"
                            width={500}
                            height={500}
                            className="sm:w-full"
                        />
                    </div>

                    <div className="relative z-10 mx-auto space-y-4 text-white">
                        <div className="flex flex-col lg:flex-row gap-6 pb-4">
                            <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold font-montserrat">
                                BALKANSYYAHAT
                            </h3>
                        </div>
                        <hr className="border-white w-full" />

                        <div className="flex flex-col lg:flex-row xl:text-lg pt-8 gap-8 mb-4">
                            <div className="w-full">
                                <div className="flex flex-col space-y-5 max-w-xl">
                                    <p className="text-md">{t("footer-text")}</p>
                                    <div className="flex space-x-4">{renderMessengerIcons()}</div>
                                </div>
                            </div>

                            <div className="w-full flex flex-col sm:flex-row gap-8">
                                <div className="flex flex-col space-y-4 w-full">
                                    <p className="font-bold text-2xl">{t("footer-contacts")}</p>

                                    {locations.map((loc) => {
                                        const localizedAddress =
                                            locale === "ru"
                                                ? loc.location_ru
                                                : locale === "tk"
                                                    ? loc.location_tk
                                                    : loc.location_en;

                                        const locPhones = phones.filter(
                                            (p) => p.location_id_real === loc.id
                                        );
                                        const locMails = mails.filter(
                                            (m) => m.location_id_real === loc.id
                                        );

                                        return (
                                            <div key={loc.id} className="border-t pt-3 max-w-80">
                                                <p className="font-semibold text-lg mb-2">
                                                    {stripHtml(localizedAddress)}
                                                </p>

                                                {locPhones.map((phone) => (
                                                    <div
                                                        key={phone.id}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <FaPhoneSquareAlt />
                                                        <a href={`tel:${phone.number}`}>
                                                            <p>{phone.number}</p>
                                                        </a>
                                                    </div>
                                                ))}

                                                {locMails.map((mail) => (
                                                    <div key={mail.id} className="flex items-center gap-3">
                                                        <MdOutlineAlternateEmail />
                                                        <a href={`mailto:${mail.mail}`}>
                                                            <p>{mail.mail}</p>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col space-y-2 font-semibold w-full">
                                    <p className="text-2xl">{t("footer-quick")}</p>
                                    <div className="border-t mt-2 mb-5 max-w-80"></div>

                                    <Link href="/tour">{h("tours")}</Link>
                                    <Link href="/blog">{h("blog")}</Link>
                                    <Link href="/about">{h("about")}</Link>
                                    <Link href="/contact">{h("contacts")}</Link>

                                    <div className="flex items-center gap-3 mt-4">
                                        <FaRegClock />
                                        <p>09:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 text-center items-center justify-center text-white pb-5">
                    <p className="mb-0">All rights reserved</p>
                    <div className="flex items-center space-x-1">
                        <Image
                            src="/logo.svg"
                            alt="Hebent Tech"
                            width={20}
                            height={20}
                        />
                        <p>Hebent Tech</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
