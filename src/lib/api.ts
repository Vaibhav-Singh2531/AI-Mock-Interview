import { auth } from '@/firebase/client';

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Ensure the current user is ready before fetching
    await auth.authStateReady();
    
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : '';

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(url, {
        ...options,
        headers
    });
};
