import { Link } from 'react-router-dom';

const DashboardPage = () => {
    return (
        <>
            {/* Hero CTA Section */}
            <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-2xl p-8 mb-12 relative overflow-hidden border border-purple-800/30">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            Get Interview-Ready with AI-<br />
                            Powered Practice &amp; Feedback
                        </h1>
                        <p className="text-gray-300 mb-6 text-lg">
                            Practice on real interview questions &amp; get instant feedback
                        </p>
                        <Link
                            to="/interview"
                            className="inline-block bg-purple-600 text-white hover:bg-purple-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                            Start an Interview
                        </Link>
                    </div>
                    <div className="flex-shrink-0 ml-8">
                        <div className="relative">
                            <div className="w-64 h-55 bg-gradient-to-br from-purple-800/50 to-gray-800 rounded-2xl flex items-center justify-center relative border border-purple-600/30">
                                <img src="/robot1.png" alt="robo-dude" width={250} height={250} className="max-sm:hidden" />
                                <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-700 rounded-lg rotate-12"></div>
                                <div className="absolute -top-1 -right-3 w-6 h-6 bg-purple-600 rounded-lg rotate-45"></div>
                                <div className="absolute -bottom-2 -left-1 w-6 h-6 bg-purple-700 rounded-lg -rotate-12"></div>
                                <div className="absolute -bottom-1 -right-2 w-8 h-8 bg-purple-600 rounded-lg rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Interviews Section */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>
                <div className="interviews-section">
                    <p>You haven&apos;t taken any interviews</p>
                </div>
            </section>

            {/* Take an Interview Section */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>
                <div className="interviews-section">
                    <p>There are no new interviews available</p>
                </div>
            </section>
        </>
    );
};

export default DashboardPage;
