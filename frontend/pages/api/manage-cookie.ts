import { setCookie, deleteCookie } from "cookies-next";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    // Setting a cookie
    if ( req.method === 'POST') {
      try{
        setCookie('token', token, {
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
          status: "unsuccessful"
        });
      }

    }

    // Deleting a cookie
    if ( req.method === 'DELETE') {
      try{
        deleteCookie("token", {req, res});

        //   respond with status and message
        return res.status(200).json({
          status: "success"
        });
      }catch{
        return res.status(500).json({
          status: "unsuccessful"
        });
      }

    }
  }