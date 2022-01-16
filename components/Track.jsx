import { useRecoilState, useRecoilValue } from "recoil";
import { currentSidebarShowState } from "../atoms/showSidebarAtom";
import { currentSongIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Track({ order, song }) {
    const spotifyAPI = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentSongIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const showSidebar = useRecoilValue(currentSidebarShowState);

    const playTrack = () => {
        setCurrentTrackId(song.track.id);
        setIsPlaying(true);
        spotifyAPI.play({
            uris: [song.track.uri]
        })
    }


    return (
        <div onClick={playTrack} className="grid grid-cols-2 text-gray-400 py-3 px-5 hover:bg-gray-900 
            rounded-lg cursor-pointer text-sm md:text-base">
            <div className="flex items-center space-x-4 space-y-2">
                <p className={order < 9 && "pr-2"}>{order + 1}</p>
                <img className="h-10 w-10" src={song.track.album.images[0].url} alt="" />
                <div className="">
                    <p className="w-36 lg:64 truncate text-white">{song.track.name}</p>
                    <p className="w-40">{song.track.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline-flex">{song.track.album.name}</p>
                {!showSidebar && (
                    <p>{millisToMinutesAndSeconds(song.track.duration_ms)}</p>
                )}
            </div>
        </div>
    )
}

export default Track;