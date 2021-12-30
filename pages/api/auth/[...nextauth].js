import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify";

const refreshAccessToken = async (token) => {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    const { body: refreshToken } = await spotifyAPI.refreshAccessToken();

    
  } catch (error) {
    console.log(error);
    
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }){
      // if initial sign in 
      if(account && user){
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000 // expire time in milliseconds so * 1000
        }
      }

      // Return the previous token, if the access token hasn't expired yet
      if(Date.now() < token.accessTokenExpires){
        console.log('VALID EXISTING ACCESS TOKEN');
        return token;
      }

      // If access token has expired -> refresh it 
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...');
      return await refreshAccessToken(token);
    }
  }
})