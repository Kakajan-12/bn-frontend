export interface Tour {
    id: number;
    title_ru: string;
    title_en: string;
    title_tk: string;
    location_ru?: string;
    location_en?: string;
    location_tk?: string;
    type_ru?: string;
    type_en?: string;
    type_tk?: string;
    cat_ru?: string;
    cat_en?: string;
    cat_tk?: string;
    price: number;
    popular?: number;
    image?: string;
    duration_ru?: string;
    duration_en?: string;
    duration_tk?: string;
}
