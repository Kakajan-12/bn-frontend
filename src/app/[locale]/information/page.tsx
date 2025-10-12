
import {useTranslations} from "next-intl";
import InformationData from "@/components/Information/InformationData";

const Information=()=>{
    const t = useTranslations('Information')

    return (
        <div className="py-24">
            <div className='container mx-auto px-4'>
                <div className="flex justify-center">
                    <div className="max-w-3xl">
                        <h2 className="font-extrabold text-center mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{t('title')}</h2>
                        <p className="text-center text-sm sm:text-md md:text-lg">{t('text')}</p>
                    </div>
                </div>
                <InformationData/>
            </div>
        </div>

    )
}

export default Information;