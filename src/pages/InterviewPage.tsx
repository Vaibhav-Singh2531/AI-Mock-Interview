import { useParams } from 'react-router-dom';

const InterviewPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h3>Take Interview</h3>
            <p className="text-light-400 mt-4">Interview ID: {id}</p>
            <p className="text-light-400 mt-2">
                Voice agent will be integrated on Day 4
            </p>
        </>
    );
};

export default InterviewPage;
