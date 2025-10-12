'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
    id: number;
    title: string;
    text: string;
}

interface RouteAccordionProps {
    data: AccordionItem[];
}

export default function RouteAccordion({ data }: RouteAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full min-w-3xl mx-auto bg-white rounded-2xl shadow-md divide-y divide-gray-200">
            {data.map((item, index) => (
                <div key={item.id}>
                    {/* Заголовок */}
                    <button
                        onClick={() => toggle(index)}
                        className="flex justify-between items-center w-full px-6 py-4 text-left font-semibold text-gray-800 hover:text-[#A40000] transition-colors"
                    >
                        <span className="text-lg sm:text-xl">{item.title}</span>
                        {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-[#A40000] transition-transform duration-200" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                        )}
                    </button>

                    {/* Контент */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openIndex === index ? 'max-h-96 py-3' : 'max-h-0'
                        }`}
                    >
                        <p className="px-6 pb-4 text-gray-700 text-sm sm:text-lg leading-relaxed">
                            {item.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
