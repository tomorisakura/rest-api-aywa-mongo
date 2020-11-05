const Pictures = require('../model/pictures');

class PicturesController {
    async get(req, res) {
        try {
            const response = await Pictures.find();
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            });
        } catch (error) {
            throw error;
        }
    }

    createPictures(req, res) {
        try {
            const name = req.body.name;
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PicturesController;