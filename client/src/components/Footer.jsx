import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { assets } from "../assets/assets";

const socials = [
  {
    Icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-sagar-singh-5b92a32b1/",
  },
  {
    Icon: FaGithub,
    label: "Github",
    href: "https://github.com/mavemouth",
  },
];

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 lg:px-44 py-3">
      <img width={150} src={assets.logo} alt="" />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @https://adityasagarportfolio.netlify.app/ | All right reserved.
      </p>
      <div className="flex gap-1">
        {socials.map(({ Icon, label, href }) => (
          <a
            href={href}
            key={label}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            <Icon size={40} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
