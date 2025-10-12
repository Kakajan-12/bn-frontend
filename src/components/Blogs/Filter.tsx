'use client';

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { IoMdSearch } from "react-icons/io";
import { Blog } from "@/types/blog";

interface FilterProps {
    blogs: Blog[];
    setFilteredBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const BlogFilter: React.FC<FilterProps> = ({ blogs, setFilteredBlogs, setCurrentPage }) => {
    const s = useTranslations("Blog");
    const lang = useLocale();

    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState("");

    const applyFilters = () => {
        let filtered = [...blogs];

        if (searchValue) {
            const lower = searchValue.toLowerCase();
            filtered = filtered.filter((t) =>
                (t[`title_${lang}` as keyof Blog] as string)?.toLowerCase().includes(lower)
            );
        }

        if (sortValue === "new-to-old") {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortValue === "old-to-new") {
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        setFilteredBlogs(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        applyFilters();
    }, [searchValue, sortValue]);

    return (
        <div className="w-full mb-6">
            <div className="relative mb-6">
                <IoMdSearch size={24} className="absolute top-3 left-3 text-gray-500" />
                <input
                    type="text"
                    placeholder={s("search")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 py-3 rounded-lg bg-[#F3F3F3] text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
            </div>

            <div className="flex flex-col md:flex-row">
                <div className="flex justify-between md:justify-start items-center space-x-2 w-full mb-4 md:mb-0">
                    <p className="text-md whitespace-nowrap">{s("sort-by")}</p>
                    <select
                        value={sortValue}
                        onChange={(e) => setSortValue(e.target.value)}
                        className="block w-36 md:w-48 pl-5 py-2 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">{s("show-all")}</option>
                        <option value="new-to-old">{s("new-to-old")}</option>
                        <option value="old-to-new">{s("old-to-new")}</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default BlogFilter;
