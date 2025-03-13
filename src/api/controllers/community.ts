import { Request, Response } from 'express';
import CommunityService from '../services/community';

class CommunityController {
  async getAll(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Communities fetched successfully.',
      data: await CommunityService.findAll()
    })
  }

  async getById(req: Request, res: Response) {

  }

  async create(req: Request, res: Response) {

  }

  async updateById(req: Request, res: Response) {

  }

  async deleteById(req: Request, res: Response) {

  }
};

export default new CommunityController;