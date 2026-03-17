import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";

/**
 * Get all interviews created by a specific user, ordered by createdAt desc.
 */
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  const q = query(
    collection(db, "interviews"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Interview[];
}

/**
 * Get latest finalized interviews from OTHER users (for "Take an Interview" section).
 */
export async function getLatestInterviews(
  userId: string,
  max = 20
): Promise<Interview[]> {
  const q = query(
    collection(db, "interviews"),
    where("finalized", "==", true),
    where("userId", "!=", userId),
    orderBy("createdAt", "desc"),
    firestoreLimit(max)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Interview[];
}

/**
 * Get a single interview by its document ID.
 */
export async function getInterviewById(
  id: string
): Promise<Interview | null> {
  const docRef = doc(db, "interviews", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Interview;
}

/**
 * Get feedback for a specific interview + user combination.
 */
export async function getFeedbackByInterviewId(
  interviewId: string,
  userId: string
): Promise<Feedback | null> {
  const q = query(
    collection(db, "feedback"),
    where("interviewId", "==", interviewId),
    where("userId", "==", userId),
    firestoreLimit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const feedbackDoc = snapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}
