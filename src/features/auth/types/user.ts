/**
 * User type definition for react-query-auth integration
 */

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}
