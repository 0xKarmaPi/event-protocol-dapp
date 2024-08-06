import { COOKIES } from "@/utils/constants";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			id: "credentials",
			name: "Credentials",
			credentials: {
				username: {
					type: "text",
				},
				address: { type: "text" },
				id: {
					type: "text",
				},
			},
			async authorize(credentials, req) {
				return {
					id: credentials?.id ?? "id",
					name: credentials?.username ?? "username",
					email: credentials?.address ?? "address",
				};
			},
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (user) {
				// Optionally, set a custom cookie here if needed
				setCookie(COOKIES.ACCESSTOKEN, "your_custom_token", {
					maxAge: 30 * 24 * 60 * 60,
				});
				return true;
			}
			return false;
		},
		async jwt({ token, user }) {
			// If it's the first time the token is being created, add the user object to it
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			return session;
		},
	},
	secret: "secret",
	pages: {},
});
export { handler as GET, handler as POST };
