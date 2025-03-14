import { Request, Response } from 'express';
import CommunityService from '../services/community';
import RequestError from '../errors/request-error';
import { ExceptionType } from '../errors/exceptions';

class CommunityController {
  async getAll(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Communities fetched successfully.',
      data: await CommunityService.findAll()
    })
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    res.status(200).json({
      success: true,
      mssage: 'Community fetched successfully.',
      data: await CommunityService.findById(id)
    });
  }

  async create(req: Request, res: Response) {
    const title = req.body.title;
    const description = req.body.description;

    if (!title)
      throw new RequestError(ExceptionType.INVALID_REQUEST);

    await CommunityService.create(title, description);

    res.status(201).json({
      success: true,
      message: 'Community created successfully.'
    });
  }

  async updateById(req: Request, res: Response) {
    const id = req.params.id;

    await CommunityService.updateById(id);

    res.status(200).json({
      success: true,
      message: 'Community updated successfully.'
    });
  }

  async deleteById(req: Request, res: Response) {

  }
};

export default new CommunityController;