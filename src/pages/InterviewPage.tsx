import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInterviewById } from '@/services/firestore';
import Agent from '@/components/Agent';

const InterviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterview = async () => {
            if (!id) {
                navigate('/');
                return;
            }

            try {
                const data = await getInterviewById(id);
                if (data) {
                    setInterview(data);
                } else {
                    console.error("Interview not found");
                    navigate('/');
                }
            } catch (error) {
                console.error("Failed to fetch interview", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id, navigate]);

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse bg-white/10 h-[400px] w-full max-w-4xl rounded-xl"></div>
            </div>
        );
    }

    if (!interview) {
        return null; // Will redirect in useEffect
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] pt-12">
            <h1 className="text-3xl font-bold mb-8">Take Written AI Interview</h1>
            <p className="text-light-400 mb-12 text-center max-w-2xl">
                You are about to start a live voice interview for the role of <span className="font-semibold text-white">{interview.role}</span>.
                The AI Agent will ask you the generated questions. Click Call to begin.
            </p>
            
            <Agent 
                userName={user.name || user.email.split('@')[0]} 
                userId={user.id} 
                interviewId={interview.id}
                type="interview" 
                questions={interview.questions}
            />
        </section>
    );
};

export default InterviewPage;
