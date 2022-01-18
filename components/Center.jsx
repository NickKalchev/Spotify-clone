import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import logo from '../public/logo.png';
import sidebarLogo from '../public/sidebar_mobile.png';
import Image from "next/image";
import { currentSidebarShowState } from "../atoms/showSidebarAtom";

const colors = [
    "from-blue-500",
    "from-indigo-500",
    "from-red-500",
    "from-pink-500",
    "from-yellow-500",
    "from-green-500",
    "from-purple-500",
    "from-orange-500",
    "from-amber-500",
    "from-lime-500",
    "from-emerald-500",
    "from-cian-500",
    "from-sky-500",
    "from-violet-500",
    "from-fuchsia-500",
    "from-rose-500",
];

function Center() {
    const { data: session } = useSession();
    const [color, setColor] = useState("from-sky-500");
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [showSidebar, setShowSidebar] = useRecoilState(currentSidebarShowState);
    const spotifyAPI = useSpotify();

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId])

    useEffect(() => {
        spotifyAPI.getPlaylist(playlistId).then(data => {
            setPlaylist(data.body);
        }).catch(err => {
            console.log('An error occured!', err);
        })
    }, [spotifyAPI, playlistId])


    return (
        <div className="flex-grow items-end md:relative h-screen overflow-y-scroll scrollbar-hide">
            <header>
                <div className="absolute top-2 left-2 cursor-pointer md:hidden">
                    {showSidebar ? (
                        <Image onClick={() => setShowSidebar(!showSidebar)} src={sidebarLogo} height={60} width={60} alt="" />
                    ) : (
                        <Image onClick={() => setShowSidebar(!showSidebar)} src={logo} height={50} width={50} alt="" />
                    )}
                </div>
                <div 
                    onClick={signOut} 
                    className="flex absolute items-center bg-black space-x-3 opacity-80 hover:opacity-90 
                        cursor-pointer rounded-full p-1 pr-2 text-white top-2 md:top-5 right-2 md:right-8"
                >
                        <img className="rounded-full w-10 h-10" src={session?.user.image} alt="" />
                    <h2 className="md:pr-2">{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end -mt-24 md:mt-0 space-x-7 px-5 bg-gradient-to-b ${color} 
                to-black h-80 p-8`}>
                <img className="h-20 w-20 md:h-44 md:w-44 shadow-2xl" src={playlist?.images?.[0].url} alt="" /> 
                <div className="text-white">
                    <p>PLAYLIST</p>
                    <h1 className="text-lg md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>

            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
