'use client';

import { useEffect, useRef, useState } from "react";
import countries from "world-countries";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Booking() {
    const t = useTranslations("Booking");
    const h = useTranslations("Header");
    const locale = useLocale();
    const params = useSearchParams();

    const tourTitle = params.get("tourTitle");
    const tourId = params.get("tourId");

    const [captchaImage, setCaptchaImage] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [captchaError, setCaptchaError] = useState<string | null>(null);

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        citizenship: "",
        email: "",
        phone: "",
        date:"",
        tour:"",
        travelers: "",
        message: "",
    });


    const captchaInputRef = useRef<HTMLInputElement>(null);

    const loadCaptcha = async () => {
        try {
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/captcha`, {
            const res = await fetch(`http://localhost:3001/captcha`, {
                method: "GET",
                credentials: "include",
            });
            const svg = await res.text();
            setCaptchaImage(svg);
        } catch (err) {
            console.error("Failed to load captcha", err);
        }
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccess(null);

        try {
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-tour`, {
            const res = await fetch(`http://localhost:3001/send-tour`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...formData, captchaText }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const serverMsg =
                    data?.errors?.captcha?.[0] ||
                    (typeof data?.error === "string" && /captcha/i.test(data.error) ? data.error : null) ||
                    (typeof data?.message === "string" && /captcha/i.test(data.message) ? data.message : null);

                if (serverMsg) {
                    setCaptchaError(serverMsg);
                    setCaptchaText("");
                    await loadCaptcha();
                    requestAnimationFrame(() => captchaInputRef.current?.focus());
                } else {
                    setError(data?.error || data?.message || "Failed to submit");
                }
            } else {
                setSuccess(t("success"));
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    citizenship: "",
                    date: "",
                    tour: "",
                    travelers: "",
                    message: "",
                });
                setCaptchaText("");
                setCaptchaError(null);
                await loadCaptcha();
            }
        } catch (err) {
            setError("Server error");
            await loadCaptcha();
        } finally {
            setSending(false);
        }
    };

    const countryList = countries
        .map((c) => ({ code: c.cca2, name: c.name.common }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative h-[50vh] md:h-[500px] bg-[#1F2A36] bg-no-repeat bg-cover flex items-center justify-center">
                <Image
                    src="/booking.webp"
                    alt="booking"
                    width={500}
                    height={300}
                    className="absolute top-0 object-cover left-1/2 -translate-x-1/2 w-full"
                />
                <div className="absolute inset-0 bg-black/50 z-0" />
                <h1 className="text-white text-2xl sm:text-4xl lg:text-6xl font-bold text-center z-10 px-2">
                    {t("title")}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative z-20 -mt-80 sm:-mt-120 md:-mt-65 lg:-mt-40 px-4 md:px-8 lg:px-20 pb-10">
                    <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
                        {/* Contact info */}
                        <div className="space-y-4">
                            <p className="text-lg font-semibold text-gray-700">{h("contacts")}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder={t("fname")}
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full"
                                />
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder={t("lname")}
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full"
                                />
                                <select
                                    name="citizenship"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full md:w-1/2"
                                >
                                    <option value="">{t("citizenship")}</option>
                                    {countryList.map((c) => (
                                        <option key={c.code} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>


                                <input
                                    name="email"
                                    type="email"
                                    placeholder={t("mail")}
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full"
                                />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder={t("phone")}
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full"
                                />
                                <input
                                    name="date"
                                    type="date"
                                    placeholder={t("date")}
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="border border-[#646464] rounded-md px-4 py-2 w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-lg font-semibold text-gray-700">{t("tour-detail")}</p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    readOnly
                                    type="text"
                                    value={tourTitle || ""}
                                    className="border border-[#646464] flex-8 rounded-md px-4 py-2 w-full"
                                />
                                <input
                                    name="travelers"
                                    type="number"
                                    required
                                    placeholder={t("count")}
                                    value={formData.travelers}
                                    onChange={handleChange}
                                    className="border border-[#646464] no-spinner flex-2 rounded-md px-4 py-2 w-full"
                                />
                            </div>
                            <textarea
                                name="message"
                                placeholder={t("comment")}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full h-64 border border-[#646464] rounded-md px-2 py-2 text-start align-top"
                            />
                        </div>
                        <div className="flex justify-center w-full">
                            {success && <p className="text-green-600 mt-2">{t('success')}</p>}
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>

                        {/* CAPTCHA */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center gap-2">
                                <div dangerouslySetInnerHTML={{ __html: captchaImage }} />
                            </div>

                            <div className="w-full max-w-40">
                                <input
                                    ref={captchaInputRef}
                                    name="captchaText"
                                    value={captchaText}
                                    onChange={(e) => {
                                        setCaptchaText(e.target.value);
                                        if (captchaError) setCaptchaError(null);
                                    }}
                                    className={`border md:text-sm text-xs py-2 px-3 rounded-md w-full ${
                                        captchaError ? "border-red-500 ring-1 ring-red-500" : "border-[#646464]"
                                    }`}
                                    required
                                />
                                {captchaError && (
                                    <p id="captcha-error" role="alert" className="mt-1 text-xs text-red-600">
                                        {captchaError}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={sending}
                                className={`button-82-pushable main-background text-white rounded-md px-8 py-1 ${sending ? "opacity-70 pointer-events-none" : ""}`}
                            >
                                <span className="button-82-shadow"></span>
                                <span className="button-82-edge"></span>
                                <span className="button-82-front text">
                  {sending ? "..." : t("send")}
                </span>
                            </button>
                        </div>


                    </div>
                </div>
            </form>
        </div>
    );
}
