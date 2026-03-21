import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0c0a1a] to-[#1a1533] text-white p-6">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Page not found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl pointer-events-none opacity-20 blur-[100px] bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full" />
    </div>
  );
};

export default NotFoundPage;
