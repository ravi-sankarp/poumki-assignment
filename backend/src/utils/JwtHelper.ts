import * as jwt from 'jsonwebtoken';

class JwtHelper {
  // function for generating new jwt token
  generateToken(id: string): string {
    const jwtOptions: jwt.SignOptions = {
      expiresIn: process.env.JWT_EXPIRY!,
    };

    return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET!, jwtOptions);
  }

  // function for verifying jwt token
  async verifyToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!;
      //verify token
      jwt.verify(token, tokenSecret, async (err, payload: any) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject('Your session has expired please login again');
          } else {
            reject('Invalid session ! Please login again');
          }
        }
        resolve(payload.id);
      });
    });
  }
}

const jwtHelper = new JwtHelper();
export default jwtHelper;
