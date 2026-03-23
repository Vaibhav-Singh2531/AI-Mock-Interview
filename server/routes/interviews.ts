import express from 'express';
import { db } from '../firebase-admin';

const router = express.Router();

// Get all interviews created by a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const snapshot = await db.collection("interviews")
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const interviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(interviews);
    } catch (error) {
        console.error("Error fetching user interviews:", error);
        res.status(500).json({ error: "Failed to fetch user interviews" });
    }
});

// Get latest finalized interviews from OTHER users
router.get('/latest', async (req, res) => {
    try {
        const userId = req.user?.uid; // from auth middleware if applicable, or query param
        const excludeUserId = req.query.excludeUserId as string || userId;
        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr, 10) : 20;

        const snapshot = await db.collection("interviews")
            .where('finalized', '==', true)
            .where('userId', '!=', excludeUserId)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const interviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(interviews);
    } catch (error) {
        console.error("Error fetching latest interviews:", error);
        res.status(500).json({ error: "Failed to fetch latest interviews" });
    }
});

// Get a single interview
router.get('/:id', async (req, res) => {
    try {
        const docRef = await db.collection("interviews").doc(req.params.id).get();
        if (!docRef.exists) {
             res.status(404).json({ error: "Interview not found" });
             return;
        }
        res.json({ id: docRef.id, ...docRef.data() });
    } catch (error) {
        console.error("Error fetching interview:", error);
        res.status(500).json({ error: "Failed to fetch interview" });
    }
});

export default router;
