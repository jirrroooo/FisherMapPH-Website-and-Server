import {
  setCookie,
  deleteCookie,
  getCookie,
  hasCookie,
} from "cookies-next";
import { NextApiResponse, NextApiRequest } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  // Verifying a cookie
  if (req.method === "GET") {
    try {
      const hasToken = hasCookie("tk", { req, res });
      const tk = getCookie("tk", { req, res });

      if (tk != "" && hasToken) {
        return res.status(200).json({
          status: "success",
          token: tk,
        });
      } else {
        deleteCookie("tk", { req, res });

        return res.status(200).json({
          status: "failed",
          token: "",
        });
      }
    } catch {
      deleteCookie("tk", { req, res });
      return res.status(500).json({
        status: "failed",
        token: "",
      });
    }
  }
}
