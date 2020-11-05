const Pets = require('../model/pets');

const generateUniqpet = (name) => {
    try {
        let arr = [];
        const random = String(Math.random() * 100);
        const result = random.split('');
        console.log(result.length);
        arr.push(name);
        for (let i = 0; i < result.length; i++) {
            if(i > 10) {
                arr.push(result[i]);
            }
        }

        const uniq = Array.from(arr).join('');
        console.log(uniq);
        return uniq.toLowerCase();
        
    } catch (error) {
        throw error;
    }
}

class PetsController {

    async get(req, res) {
        try {
            const response = await Pets.find();
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            })
        } catch (error) {
            throw error;
        }
    }

    createPets(req, res) {
        try {
            const uniqclinic = req.body.uniqclinic;
            const type = req.body.type;
            const petname = req.body.petname;
            const owner = req.body.owner;
            const gender = req.body.gender;
            const weight = req.body.weight;
            const ras = req.body.ras;
            const age = req.body.age;
            const vaccine = req.body.vaccine;
            const info = req.body.info;
            const uniqname = generateUniqpet(petname);

            Pets.findOne({
                uniqname : uniqname
            })
            .then(result => {
                if(result === null) {
                    const response = new Pets({
                        clinic_uniqname : uniqclinic,
                        jenis : type,
                        nama_peliharaan : petname,
                        uniqname : uniqname,
                        pemilik_lama : owner,
                        jenis_kelamin : gender,
                        berat_peliharaan : weight,
                        ras_peliharaan : ras,
                        umur_peliharaan : age,
                        status_vaksin : vaccine,
                        informasi : info
                    });

                    response.save();

                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        results : response
                    });

                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'failed to insert data , please try again',
                        results : null
                    });
                }
            })

        } catch (error) {
            throw error;
        }
    }

    updatePets(req, res) {
        try {
            
        } catch (error) {
            throw error;
        }
    }

}

module.exports = PetsController;