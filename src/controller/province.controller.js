const axios = require('axios');
const url = require('../helpers/url');

class Province {

    getProvince = async (req, res) => {
        try {
            
            const response = await axios.get(`${url}/propinsi.json`);
            //console.log(response.data);
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
            const response = await axios.get(`${url}/kabupaten/${params}.json`);

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
            const response = await axios.get(`${url}/kecamatan/${params}.json`);

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