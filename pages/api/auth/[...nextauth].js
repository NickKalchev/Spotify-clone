import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyAPI, {
  LOGIN_URL,
} from "../../../lib/spotify";

const refreshAccessToken = async (token) => {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(
      token.refreshToken
    );

    const { body: refreshedToken } =
      await spotifyAPI.refreshAccessToken();
  
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires:
        Date.now() +
        refreshedToken.expires_in * 1000, // 1 hour (3600 s) returns from spotify API
      refreshToken:
        refreshedToken.refresh_token ??
        token.refreshToken, // replace if new one came back, else fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret:
        process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // if initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires:
            account.expires_at * 1000, // expire time in milliseconds so * 1000
        };
      }

      // Return the previous token, if the access token hasn't expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // If access token has expired -> refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  },
});
