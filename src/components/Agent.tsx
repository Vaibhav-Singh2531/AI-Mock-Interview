import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';

const CallStatus = {
  INACTIVE: 'INACTIVE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
} as const;
type CallStatus = typeof CallStatus[keyof typeof CallStatus];

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.log('Error:', error);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.removeListener('call-start', onCallStart);
      vapi.removeListener('call-end', onCallEnd);
      vapi.removeListener('message', onMessage);
      vapi.removeListener('speech-start', onSpeechStart);
      vapi.removeListener('speech-end', onSpeechEnd);
      vapi.removeListener('error', onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          userId,
          transcript: messages,
        }),
      });

      const { success, feedbackId: id } = await res.json();

      if (success && id) {
        navigate(`/interview/${interviewId}/feedback`);
      } else {
        console.log('Error saving feedback');
        navigate('/');
      }
    } catch (err) {
      console.error('API call failed', err);
      navigate('/');
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        navigate('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === 'generate') {
      await vapi.start(undefined, undefined, undefined, import.meta.env.VITE_VAPI_WORKFLOW_ID!, {
        variableValues: {
          userName: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = '';
      if (questions) {
        formattedQuestions = questions.map((question) => `- ${question}`).join('\n');
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <img
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <img
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== 'CONNECTING' && 'hidden'
              )}
            />
            <span>{isCallInactiveOrFinished ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
