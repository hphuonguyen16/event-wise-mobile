import { axiosPrivate } from "@/axios";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";

const useAxiosPrivate = () => {
  let accessToken = "";
  AsyncStorage.getItem("access_token").then((value) => {
    //@ts-ignore
    accessToken = value;
  });
  useEffect(() => {
    if (accessToken === "") {
      return;
    }
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          router.navigate("login");
          prevRequest.sent = true;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
