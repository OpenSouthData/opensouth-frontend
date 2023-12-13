import { Link } from "react-router-dom";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import Logo from "./logo";
import BIDS from "~/assets/images/partner-logos/bids.jpg";
import CHAI from "~/assets/images/partner-logos/chai.jpg";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-[#f4f4f5b3] w-full">
        <div className="max-w-maxAppWidth mx-auto px-8 tablet:px-6 largeMobile:!px-4 py-8 [&_h3]:text-[0.8rem] [&_h3]:font-semibold grid grid-cols-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-4 [&>div>div]:flex [&>div>div]:flex-col [&>div>div]:gap-4 [&>div>div>a]:w-fit [&>div>div>a]:text-[0.8rem] tablet:grid-cols-2 largeMobile:!grid-cols-1 tablet:gap-8">
          <div>
            <h3>Useful Links</h3>
            <div>
              <Link className="hover:underline" to="/categories">
                Categories
              </Link>
              <Link className="hover:underline" to="/organizations">
                Organizations
              </Link>
            </div>
          </div>
          <div>
            <h3>Support</h3>
            <div>
              <Link className="hover:underline" to="/contact">
                Contact
              </Link>
              <Link className="hover:underline" to="/faq">
                FAQ
              </Link>
              <Link className="hover:underline" to="/about">
                About us
              </Link>
              <a
                className="hover:underline"
                href="https://tally.so/r/w2KPR9"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </a>
            </div>
          </div>
          <div>
            <h3>Social Media</h3>
            <div className="!flex-row">
              <a href="" target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter className="text-2xl text-black" />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-2xl text-[#0a66c2]" />
              </a>
            </div>
          </div>
          <div>
            <h3>Developer</h3>
            <div>
              <Link className="hover:underline" to="">
                Portal API
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-maxAppWidth mx-auto px-6 tablet:px-0 w-full border-b-[1.5px] border-zinc-200 flex items-center justify-center">
        <div className=" w-full max-w-maxAppWidth flex [@media(max-width:580px)]:grid [@media(max-width:580px)]:grid-cols-1 largeMobile:!grid-cols-1 largeMobile:gap-8 items-end justify-between gap-4 p-4 px-6 [@media(max-width:580px)]:px-4">
          <Link to={"/"} className="p-6 [@media(max-width:580px)]:p-4 w-fit hover:bg-zinc-100">
            <Logo className="w-40 [@media(max-width:580px)]:w-36 largeMobile:!w-32" />
          </Link>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-center">Our Sponsors</p>
            <div className="grid grid-cols-2 [@media(max-width:900px)]:grid-cols-2 [@media(max-width:580px)]:!flex [@media(max-width:580px)]:flex-wrap gap-6 [&>figure]:max-w-[8rem] [&>figure]:w-full [&>figure]:aspect-square [&>figure>img]:w-full [&>figure>img]:h-full [&>figure>img]:object-contain">
              <figure>
                <img src={CHAI} alt="CHAI logo" />
              </figure>
              <figure>
                <img src={BIDS} alt="partner logo" />
              </figure>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 flex items-center py-3 max-w-maxAppWidth mx-auto">
        <div className="flex gap-4 items-center [&>span]:h-4 [&>span]:w-[1px] [&>span]:rounded-full [&>span]:bg-zinc-300 [&>a]:text-xs flex-wrap">
          <Link to="/terms" className="hover:underline">
            Terms of Services
          </Link>
          <span></span>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span></span>
          <div className="flex items-center gap-2">
            <p className="text-xs">Open South is licensed under</p>
            <a
              href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
              target="_blank"
              rel="license noopener noreferrer"
              className="flex items-center gap-2 text-xs hover:underline text-orange-600 font-medium"
            >
              CC BY-NC-ND 4.0
            </a>
            <div className="flex items-center gap-1 [&_img]:w-4">
              <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" />
              <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" />
              <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" />
              <img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

{
  /* <p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">Open South</span> is licensed under </p> */
}
