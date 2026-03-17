import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [coverImage] = useState(() => getRandomInterviewCover());

  useEffect(() => {
    if (!id || !userId || !user || userId !== user.id) return;

    let cancelled = false;
    getFeedbackByInterviewId(id, userId).then((fb) => {
      if (!cancelled) setFeedback(fb);
    });
    return () => {
      cancelled = true;
    };
  }, [id, userId, user]);

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
          <p className="badge-text">{normalizedType}</p>
        </div>
        <img
          src={coverImage}
          alt="cover image"
          width={90}
          height={90}
          className="rounded-full object-fit size-[90px]"
        />

        <h3 className="mt-5 capitalize">{role} Interview</h3>

        <div>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <img src="/calendar.svg" alt="calendar" width={22} height={22} />
              <p>{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <img src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills"}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link
              to={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "View Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
