const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    getUsers: async (req, res, next) => {
        try {
            let getSQL, dataSearch = []
            let getJt = `Select * from job_task;`
            for (let prop in req.query) {
                dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
            }
            console.log(dataSearch.join(' AND '))
            if (dataSearch.length > 0) {
                getSQL = `Select * from pegawai where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select * from pegawai;`
            }
            let get = await dbQuery(getSQL)
            getJt = await dbQuery(getJt)
            get.forEach(item => {
                item.jobtask = []
                getJt.forEach(el => {
                    if (item.idpegawai == el.idpegawai) {
                        item.jobtask.push(el.jobtask)
                    }
                })
            })
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    addUsers: async (req, res, next) => {
        try {
            if (req.user.idrole == 1) {
                // HASHING PASS
                let hashPassword = Crypto.createHmac("sha256", "ikea$$$").update(req.body.password).digest("hex")

                let insertSQL = `Insert into pegawai (fullName, email, telp, password, idrole, idstatus, idposisi) 
                values (${db.escape(req.body.fullName)}, ${db.escape(req.body.email)}, ${db.escape(req.body.telp)}, ${db.escape(hashPassword)}, ${req.body.idrole}, ${req.body.idstatus}, ${req.body.idposisi}) ;`
                let regis = await dbQuery(insertSQL)
                let getUser = await dbQuery(`Select * from pegawai where idpegawai = ${regis.insertId}`)
                let { idpegawai, fullName, email, telp, password, idrole, idstatus } = getUser[0]

                // Membuat Token
                let token = createToken({ idpegawai, fullName, email, telp, password, idrole, idstatus })

                res.status(201).send({ success: true, message: "Register Success" })
            } else {
                res.status(500).send("You can't complete this action, you're not Super Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    login: (req, res, next) => {
        if (req.body.email && req.body.password) {
            console.log(req.body.email)
            // HASHING PASS
            let hashPassword = Crypto.createHmac("sha256", "ikea$$$").update(req.body.password).digest("hex")
            let getSQL = `Select * from pegawai
            where email=${db.escape(req.body.email)} and password=${db.escape(hashPassword)};`
            db.query(getSQL, (err, results) => {
                if (err) {
                    res.status(500).send({ status: 'Error Mysql', message: err })
                }
                if (results.length > 0) {
                    let { idpegawai, fullName, email, telp, password, idrole, idstatus } = results[0]
                    let token = createToken({ idpegawai, fullName, email, telp, password, idrole, idstatus })
                    res.status(200).send({idpegawai, fullName, email, telp, password, idrole, idstatus, token})
                } else {
                    res.status(404).send({ status: 'Error Mysql', message: 'Invalid Email and Password' })
                }
            })
        } else {
            res.status(500).send({ error: true, message: 'Your params not complete' })
        }
    },
    updatePegawai: async (req, res, next) => {
        try {
            if (req.user.idrole == 1) {
                let updateSQL, dataSearch = []
                for (let prop in req.body) {
                    dataSearch.push(`${prop} = ${db.escape(req.body[prop])}`)
                }
                console.log(dataSearch.join(' , '))
                updateSQL = `Update pegawai set ${dataSearch.join(' , ')} where idpegawai = ${req.params.id}`
                let update = await dbQuery(updateSQL)
                res.status(200).send(update)
            } else {
                res.status(500).send("You can't complete this action, you're not Super Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            if (req.user.idrole == 1) {
                let del = `Delete from pegawai where fullName = ${db.escape(req.body.fullName)}`
                del = await dbQuery(del)
                res.status(200).send(del)
            } else {
                res.status(500).send("You can't complete this action, you're not Super Admin")
            }
        } catch (error) {
            next(error)
        }
    }
}