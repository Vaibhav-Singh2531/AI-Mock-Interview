import { useAuth } from '@/contexts/AuthContext';
import Agent from '@/components/Agent';

const InterviewGeneratePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>; // ProtectedRoute will handle redirect
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] pt-12">
            <h1 className="text-3xl font-bold mb-8">Generate AI Mock Interview</h1>
            <p className="text-light-400 mb-12 text-center max-w-2xl">
                Ready to prepare? Click the button below to start a live voice conversation 
                with your AI Agent, which will generate customized interview questions for you.
            </p>
            
            <Agent 
                userName={user.name || user.email.split('@')[0]} 
                userId={user.id} 
                type="generate" 
            />
        </section>
    );
};

export default InterviewGeneratePage;
