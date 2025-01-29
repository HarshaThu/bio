import { NextAuthOptions } from 'next-auth';
import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next';
import { JWT } from 'next-auth/jwt';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@/lib/db';

declare module 'next-auth' {
  interface Session {
      user: {
        id: string;
        email: string;
        name?: string | null;
        role: string;
        credit: number;
        bio?: string | null;
        phone?: string | null;
        address?: string | null;
      };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    credit: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    credit: number;
    sub?: string;
    email?: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // First time login - set token data from user
        token.credit = Number(user.credit || 0);
        token.role = user.role;
        console.log('Setting initial JWT token data:', {
          credit: token.credit,
          creditType: typeof token.credit,
          userData: user
        });
      } else if (trigger === "update" && session?.user?.credit) {
        // Update token if session is updated
        token.credit = Number(session.user.credit);
      }
      
      // If credit is undefined, fetch from DB
      if (typeof token.credit === 'undefined' && token.email) {
        const client = await clientPromise;
        const db = client.db();
        const userData = await db.collection('users').findOne(
          { email: token.email },
          { projection: { credit: 1 } }
        );
        if (userData?.credit) {
          token.credit = Number(userData.credit);
          console.log('Fetched credit from DB:', token.credit);
        }
      }

      console.log('Final JWT token data:', {
        credit: token.credit,
        creditType: typeof token.credit
      });
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.credit = Number(token.credit || 0);
        
        // Always fetch latest from DB
        const client = await clientPromise;
        const db = client.db();
        const userData = await db.collection('users').findOne(
          { email: session.user.email },
          { projection: { credit: 1, bio: 1, phone: 1, address: 1 } }
        );
        
        if (userData) {
          session.user.bio = userData.bio || null;
          session.user.phone = userData.phone || null;
          session.user.address = userData.address || null;
          session.user.credit = Number(userData.credit || 0);
          
          console.log('Final session data:', {
            userEmail: session.user.email,
            credit: session.user.credit,
            creditType: typeof session.user.credit,
            dbCredit: userData.credit,
            dbCreditType: typeof userData.credit
          });
        }
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db();
        
        const user = await db.collection('users').findOne(
          { email: credentials.email }
        );

        if (!user) {
          console.log('User not found');
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        console.log('Found user data:', {
          email: user.email,
          credit: user.credit,
          creditType: typeof user.credit
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          credit: Number(user.credit || 0)
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
