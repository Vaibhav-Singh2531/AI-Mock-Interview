import { useParams } from 'react-router-dom';

const FeedbackPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h3>Interview Feedback</h3>
            <p className="text-light-400 mt-4">Interview ID: {id}</p>
            <p className="text-light-400 mt-2">
                Feedback display will be implemented on Day 6
            </p>
        </>
    );
};

export default FeedbackPage;
