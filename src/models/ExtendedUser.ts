import { User as NextAuthUser } from 'next-auth';

export default interface ExtendedUser extends NextAuthUser {
  id: string;
  roles: string[];
}
