import { HomeIcon, SearchIcon, PlusCircleIcon, RssIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { ViewBoardsIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import { currentSidebarShowState } from '../atoms/showSidebarAtom';
import useSpotify from '../hooks/useSpotify';
import logo from '../public/login_logo.png';

function Sidebar() {
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    const showSidebar = useRecoilValue(currentSidebarShowState);
    const spotifyAPI = useSpotify();

    useEffect(() => {
        if(spotifyAPI.getAccessToken()){
            spotifyAPI.getUserPlaylists().then(data => {
                setPlaylists(data.body.items);
            })
        };
    }, [session, spotifyAPI]);


    return (
       <>
            {(showSidebar && isMobile) ? (
                <>
                <div className="text-gray-500 p-3 text-xs border-r border-gray-900 overflow-y-scroll
                    h-screen scrollbar-hide flex-col pr-8 -mr-5">
        
                        <div className="space-y-4 mt-16">
                                <button className="flex items-center space-x-2 font-semibold text-xs">
                                    <HomeIcon className="h-5 w-5" />
                                    <p>Home</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold text-xs">
                                    <SearchIcon className="h-5 w-5" />
                                    <p>Search</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold text-xs">
                                    <ViewBoardsIcon className="h-5 w-5" />
                                    <p>Library</p>
                                </button>
                                <hr className="border-t-[0.1px] border-gray-900" />
                            <h1 className="text-white font-bold">Playlists</h1>
                                {playlists.map(playlist => (
                                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">
                                        {playlist.name}
                                    </p>
                                ))}
                        
                        </div>
                    </div>
                </>
        
            ) : !isMobile && (
                    <>
                        <div className="text-gray-500 p-5 text-xs sm:text-base border-r border-gray-900 overflow-y-scroll
                            h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] flex-col">
                            <div className="flex pl-1 mb-8">
                                <Image src={logo} width={130} height={40} alt="" />
                            </div>
            
                            <div className="space-y-4">
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <HomeIcon className="h-7 w-7" />
                                    <p>Home</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <SearchIcon className="h-7 w-7" />
                                    <p>Search</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <ViewBoardsIcon className="h-7 w-7" />
                                    <p>Your Library</p>
                                </button>
                                <hr className="border-t-[0.1px] border-gray-900" />
                
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <PlusCircleIcon className="h-7 w-7" />
                                    <p>Create Playlist</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <HeartIcon className="h-7 w-7 text-violet-500" />
                                    <p>Liked Songs</p>
                                </button>
                                <button className="flex items-center space-x-2 font-semibold hover:text-white cursor-pointer">
                                    <RssIcon className="h-7 w-7 text-green-600" />
                                    <p>Your Episodes</p>
                                </button>
                                <hr className="border-t-[0.1px] border-gray-900" />
                
                                {playlists.map(playlist => (
                                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">
                                        {playlist.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </>
            )}
        </>
    )
};

export default Sidebar;
