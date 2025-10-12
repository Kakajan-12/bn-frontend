import {useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";

const About = ()=>{
    const t = useTranslations('About')
    return (
        <div className="my-container py-16 about flex items-center">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row space-y-8 max-w-5xl mx-auto">
                    <div className="space-y-4 md:space-y-10">
                        <p className="text-xs md:text-sm lg:text-md mb-1">{t('about-slogan')}</p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">{t('about-popular-routes')}</h2>
                        <p className="text-sm md:text-md lg:text-lg font-semibold">{t('about-main-text')}</p>
                        <div className="flex justify-center md:justify-start">
                            <Link href="/tours" className="text-white main-background px-4 py-1 rounded-lg">{t('about-button')}</Link>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <Image src="/about-main.webp" alt="about"
                               width={400}
                               height={400}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;