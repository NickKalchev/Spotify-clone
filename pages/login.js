import {
  getProviders,
  signIn,
} from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import logo from "../public/login_logo.png";

function Login({ providers }) {
  return (
    <div
      className="bg-black flex flex-col min-h-screen w-full 
      justify-center items-center"
    >
      <Head>
        <title>Login - Spotify Clone</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="mx-auto">
        <Image
          src={logo}
          width="650"
          alt=""
          objectFit="contain"
        />
      </div>

      {Object.values(providers).map(
        (provider) => (
          <div key={provider.name} className="">
            <button
              className="bg-[#15D860] text-white font-semibold 
              sm:text-lg py-5 px-10 rounded-full"
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl: "/",
                })
              }
            >
              Login with {provider.name}
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
