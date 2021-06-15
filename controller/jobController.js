const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    addJobTask: async (req, res, next) => {
        try {
            if (req.user.idrole == 1 || req.user.idrole == 2) {
                let add = `Insert into job_task (idpegawai, jobtask, deadline)
                values (${req.body.idpegawai}, ${db.escape(req.body.jobtask)}, ${db.escape(req.body.deadline)})`
                add = await dbQuery(add)
                res.status(200).send("Insert job task Successfull")
            } else {
                res.status(500).send("You can't complete this action, you're not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    getJobtask: async (req, res, next) => {
        try {
            let getSQL, dataSearch = []
            for (let prop in req.query) {
                dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
            }
            console.log(dataSearch.join(' AND '))
            if (dataSearch.length > 0) {
                getSQL = `Select jt.*, p.fullName from job_task jt join pegawai p on jt.idpegawai = p.idpegawai where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select jt.*, p.fullName from job_task jt join pegawai p on jt.idpegawai = p.idpegawai;`
            }
            let get = await dbQuery(getSQL)
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    updateJt: async (req, res, next) => {
        try {
            if (req.user.idrole == 1 || req.user.idrole == 2) {
                let updateSQL, dataSearch = []
                for (let prop in req.body) {
                    dataSearch.push(`${prop} = ${db.escape(req.body[prop])}`)
                }
                console.log(dataSearch.join(' , '))
                updateSQL = `Update job_task set ${dataSearch.join(' , ')} where idtask = ${req.params.id}`
                let update = await dbQuery(updateSQL)
                res.status(200).send(update)
            } else {
                res.status(500).send("You can't complete this action, you're not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    deleteJt: async (req, res, next) => {
        try {
            if (req.user.idrole == 1 || req.user.idrole == 2) {
                let del = `Delete from job_task where idtask = ${req.params.id}`
                del = await dbQuery(del)
                res.status(200).send(del)
            } else {
                res.status(500).send("You can't complete this action, you're not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            if (req.user.idrole == 1 || req.user.idrole == 2) {
                let dataSearch = [], getSQL
                let getJt = `Select * from job_task;`
                for (let prop in req.query) {
                    dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
                }
                console.log(dataSearch.join(' AND '))
                if (dataSearch.length > 0) {
                    getSQL = `Select p.*, s.status from pegawai p join status s on p.idstatus = s.idstatus where ${dataSearch.join(' AND ')};`
                } else {
                    getSQL = `Select p.*, s.status from pegawai p join status s on p.idstatus = s.idstatus where p.idstatus = 1;`
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
            } else {
                res.status(500).send("You can't complete this action, you're not Admin")
            }
        } catch (error) {
            next(error)
        }
    },
    getposisi: async (req, res, next) => {
        try {
            let getJt = `Select * from job_task;`
            let get = `
            with recursive posisi_leaf (idposisi, posisi, parentId, idrole) as
            (
	            Select idposisi, posisi, parentId, idrole
	            from posisi where idposisi = ${req.params.id}
	            UNION ALL
	            Select p.idposisi, p.posisi, p.parentId, p.idrole from posisi_leaf pl join posisi p
	            on p.parentId = pl.idposisi
            )
            Select p.fullName, p.idpegawai, pl.*, r.role from posisi_leaf pl join role r on pl.idrole = r.idrole join pegawai p on p.idposisi = pl.idposisi order by p.idposisi asc;
            `
            get = await dbQuery(get)
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
    }
}