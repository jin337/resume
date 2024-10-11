import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/lib/model';
import { resultProps } from '@/types/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<resultProps>): Promise<void> {
  // 连接数据库
  await connectDB();

  try {
    if (req.method === 'POST') {
      const body = req.body;
      const item = await ProjectModel.findOne({ key: body.key });

      let msg
      if (item) {
        const { acknowledged } = await ProjectModel.deleteOne(item._id, body)
        msg = acknowledged ? '删除成功' : '删除失败'
      } else {
        msg = '未找到当前数据'
      }
      res.status(200).json({
        state: 200,
        msg: msg,
      });
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
