'use client';

import {useEffect, useState} from "react";
import {useTranslations, useLocale} from "next-intl";
import {IoMdSearch} from "react-icons/io";
import {CiFilter} from "react-icons/ci";
import {Tour} from "@/types/tour"

interface Location {
    id: number;
    location_ru: string;
    location_en: string;
    location_tk: string;
}

interface TourType {
    id: number;
    type_ru: string;
    type_en: string;
    type_tk: string;
}

interface TourCategory {
    id: number;
    cat_ru: string;
    cat_en: string;
    cat_tk: string;
}

interface FilterProps {
    tours: Tour[];
    setFilteredTours: React.Dispatch<React.SetStateAction<Tour[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Filter: React.FC<FilterProps> = ({tours, setFilteredTours, setCurrentPage}) => {
    const s = useTranslations("Search");
    const lang = useLocale();

    const [searchValue, setSearchValue] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [types, setTypes] = useState<TourType[]>([]);
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [minInput, setMinInput] = useState(0);
    const [maxInput, setMaxInput] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesRes, categoriesRes, locationsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-types`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-category`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-location`),
                ]);

                const [typesData, categoriesData, locationsData] = await Promise.all([
                    typesRes.json(),
                    categoriesRes.json(),
                    locationsRes.json(),
                ]);

                setTypes(typesData);
                setCategories(categoriesData);
                setLocations(locationsData);

                if (tours.length > 0) {
                    const prices = tours.map(t => t.price);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    setMinPrice(min);
                    setMaxPrice(max);
                    setMinInput(min);
                    setMaxInput(max);
                }
            } catch (err) {
                console.error("Ошибка загрузки данных фильтра:", err);
            }
        };

        fetchData();
    }, [tours]);

    const applyFilters = () => {
        let filtered = [...tours];

        if (selectedLocation) {
            const loc = locations.find(l => l.id === selectedLocation);
            filtered = filtered.filter(t => t[`location_${lang}` as keyof Tour] === loc?.[`location_${lang}` as keyof Location]);
        }

        if (selectedType) {
            const typ = types.find(t => t.id === selectedType);
            filtered = filtered.filter(t => t[`type_${lang}` as keyof Tour] === typ?.[`type_${lang}` as keyof TourType]);
        }

        if (selectedCategory) {
            const cat = categories.find(c => c.id === selectedCategory);
            filtered = filtered.filter(t => t[`cat_${lang}` as keyof Tour] === cat?.[`cat_${lang}` as keyof TourCategory]);
        }

        filtered = filtered.filter(t => t.price >= minInput && t.price <= maxInput);

        if (searchValue) {
            const lower = searchValue.toLowerCase();
            filtered = filtered.filter(t =>
                (t[`title_${lang}` as keyof Tour] as string)?.toLowerCase().includes(lower)
            );
        }

        setFilteredTours(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        applyFilters();
    }, [selectedLocation, selectedType, selectedCategory, minInput, maxInput, searchValue]);

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        let sorted = [...tours];

        if (value === "low") sorted.sort((a, b) => a.price - b.price);
        else if (value === "high") sorted.sort((a, b) => b.price - a.price);
        else if (value === "popular") sorted = sorted.filter((t) => t.popular === 1);

        setFilteredTours(sorted);
        setCurrentPage(1);
    };

    // ✅ RESET ФИЛЬТРОВ
    const resetFilters = () => {
        setSearchValue("");
        setSelectedLocation(null);
        setSelectedType(null);
        setSelectedCategory(null);
        setMinInput(minPrice);
        setMaxInput(maxPrice);
        setFilteredTours(tours);
        setCurrentPage(1);
    };

    return (
        <div className="w-full mb-6">
            {/* Поиск */}
            <div className="relative mb-6">
                <IoMdSearch size={24} className="absolute top-3 left-3 text-gray-500"/>
                <input
                    type="text"
                    placeholder={s("search")}
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full pl-10 py-3 rounded-lg bg-[#F3F3F3] text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
            </div>
            <div className="flex flex-col md:flex-row">
                {/* Сортировка */}
                <div className="flex justify-between md:justify-start items-center space-x-2 w-full mb-4 md:mb-0">
                    <p className="text-md text-nowrap">{s("sort")}</p>
                    <select
                        onChange={handleSort}
                        className="block w-36 md:w-48 pl-5 py-2 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">{s("sort-show-all")}</option>
                        <option value="low">{s("sort-price-low")}</option>
                        <option value="high">{s("sort-price-high")}</option>
                        <option value="popular">{s("sort-popular")}</option>
                    </select>
                </div>

                {/* Кнопка фильтров */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setFilterVisible(!filterVisible)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                    >
                        <CiFilter size={22}/>
                        <span>{s("filter")}</span>
                    </button>
                </div>
            </div>


            {/* Блок фильтров */}
            {filterVisible && (
                <>
                    {/* затемнённый фон */}
                    <div
                        onClick={() => setFilterVisible(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* модальное окно */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="relative bg-white shadow-2xl border rounded-2xl w-full max-w-lg p-6 animate-fade-in">

                            {/* RESET */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={resetFilters}
                                    className="text-red-700 hover:underline transition"
                                >
                                    {s("reset")}
                                </button>
                            </div>

                            {/* Страна */}
                            <p className="font-semibold mb-2">{s("country")}</p>
                            <select
                                value={selectedLocation ?? ""}
                                onChange={e => setSelectedLocation(e.target.value ? Number(e.target.value) : null)}
                                className="border p-2 rounded-md w-full mb-4"
                            >
                                <option value="">{s("destination")}</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc[`location_${lang}` as keyof Location]}
                                    </option>
                                ))}
                            </select>

                            {/* Тип тура */}
                            <p className="font-semibold mb-2">{s("type")}</p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {types.map(typ => (
                                    <button
                                        key={typ.id}
                                        onClick={() => setSelectedType(typ.id)}
                                        className={`py-2 px-3 rounded-full border text-sm transition ${
                                            selectedType === typ.id ? "bg-[#A40000] text-white" : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {typ[`type_${lang}` as keyof TourType]}
                                    </button>
                                ))}
                            </div>

                            {/* Категория */}
                            <p className="font-semibold mb-2">{s("category")}</p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`py-2 px-3 rounded-full border text-sm transition ${
                                            selectedCategory === cat.id ? "bg-[#A40000] text-white" : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {cat[`cat_${lang}` as keyof TourCategory]}
                                    </button>
                                ))}
                            </div>

                            {/* Цена */}
                            <p className="font-semibold mb-2">{s("price")}</p>
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="number"
                                    value={minInput}
                                    min={minPrice}
                                    max={maxInput}
                                    onChange={e => setMinInput(Number(e.target.value))}
                                    className="border p-2 rounded w-1/2"
                                />
                                <input
                                    type="number"
                                    value={maxInput}
                                    min={minInput}
                                    max={maxPrice}
                                    onChange={e => setMaxInput(Number(e.target.value))}
                                    className="border p-2 rounded w-1/2"
                                />
                            </div>
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={maxInput}
                                onChange={e => setMaxInput(Number(e.target.value))}
                                className="w-full accent-red-600 mb-6"
                            />

                            {/* Кнопка применить */}
                            <button
                                onClick={() => setFilterVisible(false)}
                                className="bg-[#A40000] hover:bg-[#900000] text-white py-2 rounded-lg transition w-full"
                            >
                                {s("save")}
                            </button>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default Filter;
