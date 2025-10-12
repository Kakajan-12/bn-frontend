import {FaRegStar} from "react-icons/fa";

function renderStars(rating: number) {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
        if (rating >= i) {
            stars.push(<FaRegStar key={i} className="text-yellow-500 w-5 h-5" />);
        }
    }

    return <div className="flex items-center gap-1">{stars}</div>;
}

export default renderStars