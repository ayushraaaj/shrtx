const Footer = () => {
    return (
        <footer className="w-full py-8 border-t border-zinc-200 flex justify-center text-zinc-400 text-xs">
            &copy; {new Date().getFullYear()} Shrtx Inc.
        </footer>
    );
};

export default Footer;
