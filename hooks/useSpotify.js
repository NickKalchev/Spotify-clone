import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import spotifyAPI from "../lib/spotify";

function useSpotify() {
    const { data: session, status } = useSession();

    useEffect(() => {
       if(session){
           // If the refresh of the token fails, redirect to login page
           if(session.error === 'RefreshAccessTokenError'){
            signIn();
           }

           spotifyAPI.setAccessToken(session.user.accessToken);
       }
    }, [session])

    return spotifyAPI;
}

export default useSpotify;
