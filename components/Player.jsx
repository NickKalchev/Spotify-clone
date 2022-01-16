import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentSongIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { RewindIcon, SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, RefreshIcon } from '@heroicons/react/solid';
import { HeartIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import { debounce } from "lodash";


function Player() {
    const spotifyAPI = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentSongIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(100);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyAPI.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item.id);
                console.log('Playing -> ' + data.body?.item);

                spotifyAPI.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const handlePlay = () => {
        spotifyAPI.getMyCurrentPlaybackState().then(data => {
            if(data.body.is_playing) {
                spotifyAPI.pause();
                setIsPlaying(false);
            } else {
                spotifyAPI.play();
                setIsPlaying(true);
            }
        });
    };

    const debouncedVolume = useCallback(() => {
        debounce((volume) => {
            spotifyAPI.setVolume(volume).catch(err => {})
        }, 250)
    }, []);

    useEffect(() => {
        if (spotifyAPI.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
        }
    }, [currentTrackId, spotifyAPI, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedVolume(volume);
        }
    }, [volume])

    return (
        <div className="text-white h-24 bg-gradient-to-b from-black to-gray-900
            grid grid-cols-1 grid-rows-1 md:grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center -mb-4 md:mb-0 space-x-4 order-2">
                <img className='h-10 w-10' src={songInfo?.album.images?.[0].url} alt="" />
                <div className="">
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-3 md:space-x-4 order-1 md:order-2">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" onClick={() => spotifyAPI.skipToPrevious()} />

                {isPlaying ? (
                    <PlayIcon onClick={handlePlay} className="button w-10 h-10" />
                ) : (
                    <PauseIcon onClick={handlePlay} className="button w-10 h-10" />
                )}

                <FastForwardIcon className="button" onClick={() => spotifyAPI.skipToNext()} />
                <RefreshIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-0 justify-end order-2 md:order-3">
                {volume !== 0 ? (
                    <VolumeUpIcon onClick={() => setVolume(0)} className="w-4 h-4 md:button" />
                ) : (
                    <VolumeOffIcon onClick={() => setVolume(50)} className="w-4 h-4 md:button" />
                )}
                <input 
                    className="w-20 md:w-32 cursor-pointer" 
                    onChange={e => setVolume(Number(e.target.value))} 
                    type="range" 
                    value={volume} 
                    min={0}
                    max={100}
                />
            </div>

            
        </div>
    )
}

export default Player;
