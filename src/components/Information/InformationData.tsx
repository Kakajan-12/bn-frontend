'use client';

import { useState } from "react";
import {useTranslations} from "next-intl";
import VisaInfo from "@/components/Information/VisaInfo";
import HotelInfo from "@/components/Information/HotelInfo";

const informationData = ()=>{
    const t = useTranslations('Information')
    const [activeTab, setActiveTab] = useState<"visa" | "hotel">("visa");

    return(
        <div className="pt-10">
            <div className="flex justify-center space-x-2 mb-5">
                <button
                    onClick={() => setActiveTab("visa")}
                    className={`w-48 py-3 rounded-lg font-medium main-border transition-all cursor-pointer text-sm md:text-md lg:text-lg
            ${activeTab === "visa"
                        ? "main-background text-white"
                        : "main-color"}`}
                >
                    {t("visa")}
                </button>

                <button
                    onClick={() => setActiveTab("hotel")}
                    className={`w-48 py-3 rounded-lg font-medium main-border transition-all cursor-pointer text-sm md:text-md lg:text-lg
            ${activeTab === "hotel"
                        ? "main-background text-white"
                        : "main-color"}`}
                >
                    {t("hotel")}
                </button>
            </div>

            <div className="">
                {activeTab === "visa" && <VisaInfo />}

                {activeTab === "hotel" && <HotelInfo/>}
            </div>
        </div>

    )
}

export default informationData;