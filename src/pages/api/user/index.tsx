import { connectDB } from '@/lib/db';
import { UserModel } from '@/lib/model';
import { resultProps } from '@/types/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<resultProps>): Promise<void> {
  // 连接数据库
  await connectDB();

  try {
    if (req.method === 'GET') {
      const user = await UserModel.find({ id: 1 });
      if (user) {
        const userEN = user.find(e => e.type == 'en')
        const userCN = user.find(e => e.type == 'cn')

        res.status(200).json({
          state: 200,
          msg: '',
          data: {
            en: userEN || {},
            cn: userCN || {},
          },
        });
      } else {
        res.status(404).json({
          state: 404,
          msg: '用户未找到',
        });
      }
    } else {
      res.status(405).json({
        state: 405,
        msg: 'Method Not Allowed',
      });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      state: 500,
      msg: '服务器错误',
      error: err.message
    });
  }
}
