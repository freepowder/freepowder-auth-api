import * as express from 'express';
import CmsServerController from './controller/cms.controller';
import CmsPolicy from './policy/cms.policy';

class CmsRoutes {
    public mount (app: express.Application) {

        app.route('/api/wierzbianski/content')
            .get(CmsPolicy.isAllowed, CmsServerController.list)
            .post(CmsPolicy.isAllowed, CmsServerController.create);

        app.route('/api/wierzbianski/content/:contentId')
            .get(CmsPolicy.isAllowed, CmsServerController.read)
            .put(CmsPolicy.isAllowed, CmsServerController.update)
            .delete(CmsPolicy.isAllowed, CmsServerController.delete);

        // app.route('/api/cms/videos')
        //     .get(CmsPolicy.isAllowed, CmsVideoServerController.list)
        //     .post(CmsPolicy.isAllowed, CmsVideoServerController.create);
        //
        // app.route('/api/cms/videos/:videoId')
        //     .get(CmsPolicy.isAllowed, CmsVideoServerController.read)
        //     .put(CmsPolicy.isAllowed, CmsVideoServerController.update)
        //     .delete(CmsPolicy.isAllowed, CmsVideoServerController.delete);
        //
        // app.route('/api/cms/photos')
        //     .get(CmsPolicy.isAllowed, CmsPhotoServerController.list)
        //     .post(CmsPolicy.isAllowed, CmsPhotoServerController.create);
        //
        // app.route('/api/cms/photos/:photoId')
        //     .get(CmsPolicy.isAllowed, CmsPhotoServerController.read)
        //     .put(CmsPolicy.isAllowed, CmsPhotoServerController.update)
        //     .delete(CmsPolicy.isAllowed, CmsPhotoServerController.delete);
        //
        // app.route('/api/cms/reviews')
        //     .get(CmsPolicy.isAllowed, CmsReviewsServerController.list)
        //     .post(CmsPolicy.isAllowed, CmsReviewsServerController.create);
        //
        // app.route('/api/cms/reviews/:reviewId')
        //     .get(CmsPolicy.isAllowed, CmsReviewsServerController.read)
        //     .put(CmsPolicy.isAllowed, CmsReviewsServerController.update)
        //     .delete(CmsPolicy.isAllowed, CmsReviewsServerController.delete);

        app.param('contentId', CmsServerController.contentByID);
        // app.param('videoId', CmsVideoServerController.videoByID);
        // app.param('photoId', CmsPhotoServerController.photoByID);
        // app.param('reviewId', CmsReviewsServerController.reviewByID);
    }
}

export default new CmsRoutes();
