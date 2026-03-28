"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../style.module.css";
import { useMsal } from "@azure/msal-react";
import { connect } from "react-redux";

import {
  encyptingPass,
  getLogo,
  getResponePopup,
} from "@/util/reusableFunction";
import { loginAuth } from "@/models/auth";
import { actions as authAction } from "@/state/auth/index";
import RegularButton from "@/components/regularButton";
import MS_Logo from "../../../../public/images/auth/logos_microsoft-icon.webp";
import GoogleLogo from "../../../../public/images/auth/devicon_google.webp";

import Footer from "@/components/footer";
import { setStorage } from "@/util/storage";

import authTypes from "@/state/auth/model";
import { loginTypes } from "@/models/(withoutheader)/login";
import { useRouter } from "next/navigation";

function Login({ getMFAValidation, loginResponse }: loginTypes) {
  const router = useRouter();
  const [enteredEmail, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailErro, setEmailError] = useState<{ email: string }>({ email: "" });
  const [errors, setErrors] = useState<loginAuth>({ email: "", password: "" });
  const [isClickAuth, setClickAuth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const validateEmail = (enteredEmail: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    setEmailError({ email: "" });

    if (enteredEmail?.length === 0) {
      setEmailError({
        email: "Please enter the email",
      });

      return false;
    }
    if (enteredEmail?.length > 0 && !emailRegex.test(enteredEmail)) {
      setEmailError({
        email: "Invalid email",
      });
      return false;
    }

    return true;
  };
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValidation = validateEmail(enteredEmail);
    if (emailValidation) {
      setErrors({
        email: "",
        password: "",
      });
      const res = await getMFAValidation({
        username: enteredEmail,
        route: router,
        password: encyptingPass(password),
      });
      if (res?.status !== "SUCCESS") {
        getResponePopup(res);
      }
    } else {
      return;
    }
  };

  const { instance, accounts, inProgress } = useMsal();
  const handleClick = () => {
    if (inProgress !== "none") return;

    // Always redirect to login when accounts are empty
    if (accounts.length === 0) {
      console.log("No session found. Forcing Outlook SSO login...");

      // Use prompt=login to force MS login page even if SSO cookie is present
      instance
        .loginRedirect({
          prompt: "login", // ✅ Forces user to re-enter credentials
          scopes: ["User.Read", "offline_access"],
        })
        .catch((error) => {
          console.error("Login error:", error);
        });

      return;
    }
  };

  useEffect(() => {
    if (inProgress === "none") {
      if (accounts.length > 0) {
        setStorage("token", accounts[0]?.idToken);
        router.replace("/projects");
      } else {
        setIsLoading(false);
      }
    }
  }, [accounts, inProgress, router]);

  if (isLoading) {
    return <div>{/* <PageLoading /> */}</div>;
  }
  return (
    <>
      {
        <div className="page-wraper">
          <div className={`login-account`}>
            <div className={`flex flex-col justify-center gap-1`}>
              <div className="self-center">
                <div className="account-info-area">
                  <div
                    className="login-content"
                    style={{ position: "relative", textAlign: "center" }}
                  >
                    {getLogo()}
                  </div>
                </div>

                <div className="self-center">
                  <div className="login-form">
                    <div className="flex items-center justify-center">
                      <h2 className="title font-bold">Welcome</h2>
                    </div>
                    {!isClickAuth && (
                      <form onSubmit={onLogin} autoComplete="off">
                        <div className="login-input">
                          <label className="mb-1 text-slate-800">
                            Your Username
                          </label>
                          <div id="select-email" data-name="select-email">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              className="form-control px-2"
                              value={enteredEmail}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                              }}
                              placeholder="Enter your username"
                            />
                          </div>
                          {emailErro?.email && (
                            <div className="text-red-500 text-[12px] mt-3">
                              {emailErro?.email}
                            </div>
                          )}
                        </div>
                        <div className="login-input">
                          <label className="mb-1 text-slate-800">
                            Your Password
                          </label>
                          <div id="select-password" data-name="select-password">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              className="form-control px-2"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                            />
                          </div>
                          {errors?.password && (
                            <div className="text-red-500 text-[12px]">
                              {errors?.password}
                            </div>
                          )}
                        </div>

                        <div
                          id="login-submit"
                          data-name="login-submit"
                          className="text-center login-btn"
                        >
                          <RegularButton
                            type="submit"
                            name="Get Started"
                            width="100%"
                            loading={loginResponse}
                            disabled={true}
                            padding="10px"
                          />
                        </div>

                        <div className="social-login mt-1 text-center">
                          <div className="flex items-center justify-center or-divider mb-1">
                            <div className={`flex-grow ${styles.line}`}></div>
                            <span className="mx-2 text-slate-500 login-option">
                              Or
                            </span>
                            <div className={`flex-grow ${styles.line}`}></div>
                          </div>
                          <div className="login-with">
                            <small className="mx-2 text-slate-500 login-option">
                              Login With
                            </small>
                          </div>
                          <div className="flex justify-center gap-2">
                            <div
                              id="click-ms-login"
                              className="cursor-pointer"
                              onClick={() => {
                                // setClickAuth("MS");
                                handleClick();
                              }}
                            >
                              <Image
                                className="login-logo mx-3 md:mx-0"
                                src={MS_Logo}
                                style={{ width: "30px", height: "30px" }}
                                alt="mslogo"
                              />
                            </div>

                            <div
                              id="click-google-login"
                              className="cursor-pointer"
                              onClick={() => {
                                setClickAuth("Client");
                              }}
                            >
                              <Image
                                className="login-logo"
                                src={GoogleLogo}
                                style={{ width: "30px", height: "30px" }}
                                alt="google"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                  <div className="login-footer">
                    <Footer isLogo={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

const connector = connect(
  (state: { authReducer: authTypes }) => ({
    loginResponse: state?.authReducer?.mfaLoader,
  }),
  {
    getMFAValidation: authAction?.getMFAValidation,
  }
);

export default connector(Login);
