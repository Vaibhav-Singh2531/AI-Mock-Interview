import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { TrendingUp, TrendingDown, User, Clock, Star } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { getInterviewById, getFeedbackByInterviewId } from '@/services/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const FeedbackPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [interview, setInterview] = useState<any>(null);
    const [feedbackData, setFeedbackData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !user) return;
            
            try {
                const interviewData = await getInterviewById(id);
                if (!interviewData) {
                    navigate('/');
                    return;
                }
                setInterview(interviewData);

                const feedback = await getFeedbackByInterviewId(id, user.id);
                setFeedbackData(feedback);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, user, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900/30 to-gray-900/50 flex items-center justify-center">
                <div className="text-white">Loading feedback...</div>
            </div>
        );
    }

    if (!feedbackData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900/30 to-gray-900/50 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                    <h2 className="text-2xl font-bold">No feedback available yet!</h2>
                    <p className="text-gray-400">Please complete the interview first.</p>
                    <Button asChild className="mt-4">
                        <Link to="/">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900/30 to-gray-900/50 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                {/* Header Section */}
                <div className="text-center space-y-4 mt-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        <span className="capitalize">{interview?.role}</span> Interview
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{feedbackData?.createdAt ? dayjs(feedbackData.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}</span>
                    </div>
                </div>

                {/* Overall Score Card */}
                <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white">Overall Impression</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <div className={`text-6xl font-bold ${getScoreColor(feedbackData.totalScore)}`}>
                                {feedbackData.totalScore}
                                <span className="text-2xl text-gray-400">/100</span>
                            </div>
                            <Progress
                                value={feedbackData.totalScore}
                                className="mt-4 h-3"
                            />
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-2 text-blue-400">Final Assessment</h3>
                            <p className="text-gray-300 leading-relaxed">{feedbackData.finalAssessment}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Scores */}
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Detailed Scores by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {feedbackData.categoryScores?.map((category: any, index: number) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-white">{category.name}</h3>
                                    <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                                        {category.score}%
                                    </div>
                                </div>
                                <Progress value={category.score} className="h-2" />
                                <p className="text-gray-400 text-sm leading-relaxed">{category.comment}</p>
                                {index < feedbackData.categoryScores.length - 1 && (
                                    <Separator className="bg-gray-700 mt-4" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Strengths and Areas for Improvement */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/50 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-400">
                                <TrendingUp className="w-5 h-5" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {feedbackData.strengths?.map((strength: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300">{strength}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <TrendingDown className="w-5 h-5" />
                                Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {feedbackData.areasForImprovement?.map((area: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2" />
                                    <span className="text-gray-300">{area}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Button variant="secondary" className="flex-1" asChild>
                        <Link to="/">
                            <span className="text-sm font-semibold text-center">
                                Back to dashboard
                            </span>
                        </Link>
                    </Button>

                    <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" asChild>
                        <Link to={`/interview/${id}`}>
                            <span className="text-sm font-semibold text-center">
                                Retake Interview
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
