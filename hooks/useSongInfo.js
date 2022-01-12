import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentSongIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
  const spotifyAPI = useSpotify();
  const [currentSongId, setCurrentSongId] =
    useRecoilState(currentSongIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentSongId) {
        const songInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentSongId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyAPI.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(songInfo);
      }
    };

    fetchSongInfo();
  }, [currentSongId, spotifyAPI]);

  return songInfo;
}

export default useSongInfo;
