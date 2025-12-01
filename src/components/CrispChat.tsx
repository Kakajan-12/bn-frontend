'use client';

import { useEffect } from 'react';

const CrispChat = () => {
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
            console.error('Crisp Website ID is missing!');
            return;
        }

        window.$crisp = [];
        window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

        const script = document.createElement('script');
        script.src = "https://client.crisp.chat/l.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            const script = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
            if (script?.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
};

declare global {
    interface Window {
        $crisp: any[];
        CRISP_WEBSITE_ID: string;
    }
}

export default CrispChat;