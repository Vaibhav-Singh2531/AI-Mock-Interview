

import { fetchWithAuth } from "@/lib/api";

/**
 * Get all interviews created by a specific user, ordered by createdAt desc.
 */
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  const response = await fetchWithAuth(`/api/interviews/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user interviews");
  }
  return await response.json() as Interview[];
}

/**
 * Get latest finalized interviews from OTHER users (for "Take an Interview" section).
 */
export async function getLatestInterviews(
  userId: string,
  max = 20
): Promise<Interview[]> {
  const response = await fetchWithAuth(`/api/interviews/latest?excludeUserId=${userId}&limit=${max}`);
  if (!response.ok) {
    throw new Error("Failed to fetch latest interviews");
  }
  return await response.json() as Interview[];
}

/**
 * Get a single interview by its document ID.
 */
export async function getInterviewById(
  id: string
): Promise<Interview | null> {
  const response = await fetchWithAuth(`/api/interviews/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch interview");
  }
  return await response.json() as Interview;
}

/**
 * Get feedback for a specific interview + user combination.
 */
export async function getFeedbackByInterviewId(
  interviewId: string,
  _userId: string
): Promise<Feedback | null> {
  const response = await fetchWithAuth(`/api/feedback?interviewId=${interviewId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  return await response.json() as Feedback | null;
}

