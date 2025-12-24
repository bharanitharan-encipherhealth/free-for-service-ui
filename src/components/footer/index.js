import React from "react";
import Hcc_LOGO from "../../../public/images/footer/EncipherLogo1.webp";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = ({ isLogo = true }) => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const handleEncipherhealthClick = () => {
    window.open("https://encipherhealth.com/", "_blank");
  };
  const currentPath = router?.pathname;
  return (
    <footer className="text-center mt-5">
      <div
        className={
          currentPath === "/reviewer/patients/details"
            ? `d-flex background-white`
            : `d-flex`
        }
      >
        <div
          className=" d-flex flex-column align-items-center justify-content-center"
          style={{ margin: "0 auto" }}
        >
          <div className="d-flex align-items-center mb-3">
            {isLogo && (
              <Image
                src={Hcc_LOGO}
                alt="Encipher Health Logo"
                style={{ height: "84px", width: "95px" }}
              />
            )}
            <p
              className="mb-0 hovered-text"
              onClick={handleEncipherhealthClick}
              style={{
                fontSize: "14px",
                cursor: "pointer",
                position: "relative",
                bottom: 0,
                left: isLogo ? -40 : 0,
                fontSize: "14px",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              &copy; {currentYear} Powered by Encipher Health Inc.
            </p>
            &nbsp; &nbsp;
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
