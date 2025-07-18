import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

export default function Topbar() {
  return (
    <div className="bg-[#ea2e0e] text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Social Media Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://www.facebook.com"
            aria-label="Visit our Facebook"
            className="hover:text-gray-300"
          >
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com"
            aria-label="Visit our Instagram"
            className="hover:text-gray-300"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            aria-label="Visit our Twitter"
            className="hover:text-gray-300"
          >
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>

        {/* Shipping Info */}
        <div className="text-sm text-center flex-grow">
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>

        {/* Contact Info */}
        <div className="text-sm hidden md:block">
          <a href="tel:+123456789" className="hover:text-gray-300">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
}
