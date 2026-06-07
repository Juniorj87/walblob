import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import Dashboard from './components/sections/Dashboard';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NetworkProvider } from './context/NetworkContext';

// Lazy load secondary sections for performance (Priority 6)
const Docs = lazy(() => import('./components/sections/Docs'));
const Privacy = lazy(() => import('./components/sections/Privacy'));
const Status = lazy(() => import('./components/sections/Status'));
const Retrieve = lazy(() => import('./components/sections/Retrieve'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#020617] flex items-center justify-center">
    <div className="relative">
      <motion.img 
        src="/walblob-logo.png"
        alt="WalBlob Loading"
        className="w-20 h-20 object-contain relative z-10"
        animate={{ 
          opacity: [0.4, 1, 0.4],
          scale: [0.95, 1, 0.95]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 bg-[#4F7CFF]/20 blur-3xl rounded-full" />
    </div>
  </div>
);

const { networkConfig } = createNetworkConfig({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mainnet: { url: 'https://fullnode.mainnet.sui.io:443', network: 'mainnet' as any },
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	testnet: { url: 'https://fullnode.testnet.sui.io:443', network: 'testnet' as any },
});

const queryClient = new QueryClient();

function App() {
  const [path, setPath] = useState(window.location.pathname);

  // Simple client-side routing
  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  // Replace standard links with our navigate function globally
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        const href = anchor.getAttribute('href')!;
        const validPaths = ['/status', '/docs', '/privacy', '/', '/retrieve'];
        if (validPaths.includes(href)) {
          e.preventDefault();
          navigate(href);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
				<WalletProvider autoConnect>
					<NetworkProvider>
						<div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-[#4F7CFF]/30">
							<Suspense fallback={<LoadingFallback />}>
								{path === '/docs' && <Docs />}
								{path === '/privacy' && <Privacy />}
								{path === '/status' && <Status />}
								{path === '/retrieve' && <Retrieve />}
								{(path === '/' || !['/docs', '/privacy', '/status', '/retrieve'].includes(path)) && <Dashboard />}
							</Suspense>
						</div>
					</NetworkProvider>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

export default App;
