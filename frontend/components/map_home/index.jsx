import dynamic from 'next/dynamic';

const MapHome = dynamic(() => import('./map'), {
    ssr: false
});

export default MapHome;