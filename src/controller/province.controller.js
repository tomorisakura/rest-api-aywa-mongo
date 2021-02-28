const axios = require('axios');
const { baseUrl } = require('../config/constant');

class Province {

    getProvince = async (req, res) => {
        try {
            
            const response = await axios.get(`${baseUrl}/propinsi.json`);
            res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response.data
            });
        } catch (error) {
            throw error;
        }
    }

    getKabupaten = async (req, res) => {
        try {
            const params = req.params.id;
            const response = await axios.get(`${baseUrl}/kabupaten/${params}.json`);

            res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response.data
            });
        } catch (error) {
            throw error;
        }
    }

    getKecamatan = async (req, res) => {
        try {
            const params = req.params.id;
            const response = await axios.get(`${baseUrl}/kecamatan/${params}.json`);

            res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response.data
            });

        } catch (error) {
            throw error;
        }
    }

}

module.exports = Province;