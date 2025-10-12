import Main from "@/app/[locale]/Main";
import About from "@/app/[locale]/About";
import Gallery from "@/app/[locale]/Gallery";
import Blog from "@/app/[locale]/Blog";

export default function Home() {
    return (
        <>
            <Main/>
            <About/>
            <Gallery/>
            <Blog/>
        </>
    );
}
