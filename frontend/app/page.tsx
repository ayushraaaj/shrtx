import Link from "next/link";

const Home = ()=> {
  return (
      <div className="flex flex-col justify-center items-center min-h-screen">
          <h1 className="font-medium text-2xl">
              Welcome to <span className="underline"> Shrtx</span>
          </h1>
          <Link
              className="mt-3 text-blue-500 focus:text-red-500 underline"
              href="/signup"
          >
              Visit signup page here
          </Link>
          <Link
              className="mt-3 text-blue-500 focus:text-red-500 underline"
              href="/login"
          >
              Visit login page here
          </Link>
      </div>
  );
}

export default Home
