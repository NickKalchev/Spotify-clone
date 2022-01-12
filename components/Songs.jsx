import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Track from "./Track";

function Songs() {
    const playlist = useRecoilValue(playlistState);

    return (
       <div className="text-white px-1 md:px-8 flex flex-col space-y-1 pb-28">
           {playlist?.tracks.items.map((data, index) =>
                <Track key={data.track.id} song={data} order={index} />
            )}
       </div>
    )
}

export default Songs
