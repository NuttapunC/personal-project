import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './schemas/auth.schema';
import { AuthApi } from './api/auth.api';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { maxAge: 86370 },
  providers: [
    Credentials({
      async authorize(input) {
        try {
          const data = loginSchema.parse(input);
          const { access_token, user } = await AuthApi.login(data);
          return { ...user, access_token };
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.role = user.role;
        token.access_token = user.access_token;
      }

      return token;
    },
    session({ token, session }) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.access_token = token.access_token;

      return session;
    }
  }
});
