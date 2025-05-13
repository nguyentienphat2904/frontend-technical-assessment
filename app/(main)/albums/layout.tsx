import { Metadata } from 'next';
import Layout from '../../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Albums | Refine',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'PrimeReact HCMUT-REACT',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        ttl: 604800
    },
    icons: {
        icon: 'https://geekup.vn/Icons/geekup-logo-general.svg'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
