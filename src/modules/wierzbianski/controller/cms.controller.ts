import { NextFunction, Request, Response } from 'express';
import Content from '../model/content';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';


class CmsContentServerController {

    public list = (req: Request, res: Response): void => {
        Content.find({}).then((content) => {
                res.status(200).json(content);
            })
            .catch((err) => {
                return res.status(422).send({message: err});
            });
    };

    public create = (req: Request, res: Response): void => {
        const _content = new Content(req.body);
        _content.save()
            .then((content) => {
                res.status(200).json(content);
            })
            .catch((err) => {
                console.log(err);
                return res.status(422).send(err);
            })
    };



    public read = (req: Request, res: Response): void => {};


    public update = (req: Request, res: Response): void => {

        Content.findById(req['content']._id)
            .then((content) => {
                // content = _.extend(content, req.body);
                content['updated'] = new Date() ;
                content['email'] = req.body.email;
                content['phone'] =  req.body.phone;
                content['featured'] =  req.body.featured;
                content['videos'] =  req.body.videos;
                content['about'] =  req.body.about;
                content['workReel'] =  req.body.workReel;
                content.save()
                    .then((_content) => {
                        res.status(200).json(_content);
                    })
                    .catch((err) => {
                        return res.status(422).send({
                            message: err
                        });
                    });
            })
            .catch((err) => {
                res.status(422).send(err);
            });
    };

    public delete = (req: Request, res: Response): void => {


    };


    public contentByID = (req: Request, res: Response, next: NextFunction, id) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: 'Content is invalid'
            });
        }

        Content.findById(id)
            .then((content) => {
                if (!content) {
                    return next(new Error('Failed to load content ' + id));
                }
                req['content'] = content;
                next();
            })
            .catch((err) => {
                console.log(err);
                return next(err);
            })

    };
}

export default new CmsContentServerController();
