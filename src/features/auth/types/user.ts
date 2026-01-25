/**
 * User type definition for react-query-auth integration
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}
