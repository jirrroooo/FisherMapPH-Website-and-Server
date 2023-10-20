import { setCookie, deleteCookie } from "cookies-next";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { tk, id } = req.body;

    // Setting a cookie
    if ( req.method === 'POST') {
      try{
        setCookie('tk', tk, {
          req,
          res,
          maxAge: 60*60, // 1hour
          path: '/',
          httpOnly: true
        });

        setCookie('id', id, {
          req,
          res,
          maxAge: 60*60, // 1hour
          path: '/',
          httpOnly: true
        });
      
        //   respond with status and message
        return res.status(200).json({
          status: "success"
        });
      }catch{
        return res.status(401).json({
          status: "failed"
        });
      }

    }

    // Deleting a cookie
    if ( req.method === 'DELETE') {
      try{
        deleteCookie("tk", {req, res});
        deleteCookie("id", {req, res});

        //   respond with status and message
        return res.status(200).json({
          status: "success"
        });
      }catch{
        return res.status(500).json({
          status: "failed"
        });
      }

    }
  }