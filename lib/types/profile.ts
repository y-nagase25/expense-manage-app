/**
 * User profile type
 * Represents user profile data from the database
 */
export type UserProfile = {
    id: string;
    email: string | null;
    businessName: string | null;
};
