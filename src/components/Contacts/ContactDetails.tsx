'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";

interface Location {
    id: number;
    [key: string]: any;
}

interface Address {
    id: number;
    location_id_real: number;
    iframe: string;
    [key: string]: any;
}

interface NumberItem {
    id: number;
    location_id_real: number;
    number: string;
}

interface Mail {
    id: number;
    location_id_real: number;
    mail: string;
}

interface GroupedData {
    location: Location | null;
    address: Address | null;
    numbers: string[];
    mail: string[];
    iframe: string;
}

const ContactDetails = () => {
    const [data, setData] = useState<GroupedData[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const t = useTranslations('Contacts');
    const lang = useLocale();

    const stripHTML = (text: string) => text?.replace(/<[^>]*>/g, '') || '';
    const getLangKey = (base: string) =>
        `${base}_${lang === 'ru' ? 'ru' : lang === 'tk' ? 'tk' : 'en'}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL not found');

                const endpoints = [
                    'api/contact-location',
                    'api/contact-address',
                    'api/contact-numbers',
                    'api/contact-mails',
                ];

                const [locationsRes, addressesRes, numbersRes, mailsRes] = await Promise.all(
                    endpoints.map((ep) =>
                        fetch(`${baseUrl}/${ep}`).then((res) => (res.ok ? res.json() : []))
                    )
                );

                const locations: Location[] = Array.isArray(locationsRes) ? locationsRes : [];
                const addresses: Address[] = Array.isArray(addressesRes) ? addressesRes : [];
                const numbers: NumberItem[] = Array.isArray(numbersRes) ? numbersRes : [];
                const mails: Mail[] = Array.isArray(mailsRes) ? mailsRes : [];

                const grouped: GroupedData[] = locations.map((loc) => {
                    const address = addresses.find((a) => a.location_id_real === loc.id) || null;
                    const numberList = numbers
                        .filter((n) => n.location_id_real === loc.id)
                        .map((n) => n.number);
                    const mailList = mails
                        .filter((m) => m.location_id_real === loc.id)
                        .map((m) => m.mail);


                    return {
                        location: loc,
                        address,
                        numbers: numberList,
                        mail: mailList,
                        iframe: address?.iframe || '',
                    };
                });

                setData(grouped);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load contact data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!data.length)
        return <div className="text-center py-20 text-gray-600">No contact data available</div>;

    const active = data[activeIndex];
    const mapSrcMatch = active?.iframe?.match(/src="([^"]+)"/);
    const mapSrc = mapSrcMatch ? mapSrcMatch[1] : '';

    return (
        <div className="w-full py-12">
            <div className="flex flex-col lg:flex-row justify-center gap-10 max-w-7xl mx-auto px-4">
                <div className="w-full lg:w-1/2 space-y-10">
                    <div className="flex flex-wrap gap-3">
                        {data.map((loc, idx) => (
                            <button
                                key={loc.location?.id ?? idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`flex-1 px-4 py-2 rounded-xl border text-center text-lg transition-all font-bold focus:outline-none cursor-pointer ${
                                    activeIndex === idx
                                        ? 'bg-[#A40000] text-white border-[#A40000]'
                                        : 'bg-white text-[#A40000] border-[#A40000] hover:bg-[#ffe5e5]'
                                }`}
                            >
                                {stripHTML(loc.location?.[getLangKey('location')] || '')}
                            </button>
                        ))}
                    </div>

                    {mapSrc && (
                        <iframe
                            src={mapSrc}
                            className="w-full h-72 rounded-lg shadow-md"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    )}
                </div>

                <div className="w-full lg:w-1/2 space-y-4">
                    <div className="flex items-start justify-start gap-4">
                        <div className="hidden sm:flex justify-center items-center rounded-full main-background w-18 h-18">
                            <IoLocationOutline className="text-white" size={38}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-semibold">
                                {stripHTML(active?.address?.[getLangKey('address')] || '')}
                            </p>
                            <div className="flex flex-col gap-1">
                                {active?.numbers?.map((phone, idx) => (
                                    <a
                                        key={idx}
                                        href={`tel:${phone}`}
                                        className="text-lg"
                                    >
                                        {phone}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start justify-start gap-4">
                        <div
                            className="hidden sm:flex justify-center items-center rounded-full main-background w-18 h-18">
                            <MdOutlineAlternateEmail className="text-white" size={38}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl font-semibold">{t('email')}</p>
                            <div className="flex flex-col gap-1">
                                {active?.mail?.map((mail, idx) => (
                                    <a
                                        key={idx}
                                        href={`mailto:${mail}`}
                                        className="text-lg"
                                    >
                                        {mail}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
