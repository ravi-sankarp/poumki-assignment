import bcrypt from 'bcryptjs';

class PasswordHelper {
  //function for hashing passwords
  async hashPwd(pwd: string): Promise<string> {
    const hashedPwd = await bcrypt.hash(pwd, 12);
    return hashedPwd;
  }

  //function for comparing two passwords
  async comparePassword(plaintextPwd: string, hashedPwd: string): Promise<boolean> {
    const result = await bcrypt.compare(plaintextPwd, hashedPwd);
    return result;
  }
}

const passwordHelper = new PasswordHelper();

export default passwordHelper;
