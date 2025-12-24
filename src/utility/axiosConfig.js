const axios = require("axios");
import Swal from "sweetalert2";
import { getStorage } from "../util/storage";

axios.interceptors.request.use(
  (config) => {
    let _list = [
      "/securityservice/auth/admin/login",
      "/securityservice/auth/organization/create",
      "/securityservice/auth/login",
    ];
    const currentUrl = config?.url?.split("/secure")[1];
    if (!_list.includes(currentUrl)) {
      config.headers["Authorization"] = `Bearer ${getStorage("token")}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const statusCode = error?.response?.status;

    if (statusCode === 500) {
      Swal.fire({
        title: "Internal Server Error!",
        text: error?.response?.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    if (statusCode === 503) {
      Swal.fire({
        title: "Service Unavailable!",
        text: error?.response?.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    if (statusCode === 400) {
      Swal.fire({
        title: "Bad Request!",
        text: error?.response?.data.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    if (statusCode === 401) {
      Swal.fire({
        title: "",
        text: "Your session has timed out. Please log in again.",
        icon: "warning",
        confirmButtonText: "Logout",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = "/login";
        }
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
