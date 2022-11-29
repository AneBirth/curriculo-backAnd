const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=> {console.log('Olá')})

app.get('/empresas', async (req,res)=> {
    try{
       const { rows } = await pool.query("SELECT * FROM empresas")
       return res.status(200).send(rows)
    } catch(err){
        return res.status(400).send(err)
    }
})

app.post('/session', async (req, res) =>{
  const {empresaname} = req.body
  try{
    const newSession = await pool.query("INSERT INTO empresas(empresa_name) VALUES ($1) RETURNING *", [empresaname])
    return req.status(200).send(newSession.rows)
  }catch(err){
        return res.status(400).send(err)
}
} )

app.post('/cargo/:empresa_id', async (req,res) => {
    const {description , done }= req.body
    const {empresa_id} = req.params
    try{
        const newCargo = await pool.query("INSERT INTO cargos (cargo_description, cargo_done, empresa_id) VALUES ($1, $2, $3) RETURNING * ", [description,done,empresa_id] )
        return res.status(200).send(newCargo.rows)
    }catch(err){
        return res.status(400).send(err)
}

})

app.get('/cargo/:empresa_id',async (req,res)=>{
    const {empresa_id} = req.params
    try{
        const allcagos = await pool.query("SELECT * FROM cargos WHERE empresa_id = ($1)",[empresa_id])
        return res.status(200).send(allCargos.rows)
    }catch(err){
        return res.status(400).send(err)
    }

})

app.patch('/cargo/:user_id/:todo_id',async (req, res)=> {
    const { cargo_id } = req.params
    const data = req.body
    try{
        const updateCargo = await pool.query('UPDATE cargos SET cargo_description = ($1),cargo_done =($2) WHERE cargo_id = ($3) RETURNING *',
        [data.description, data.done, cargo_id])
        return res.status(400).send(updateCargo.rows)
    } catch(err){
        return res.status(400).end(err)
    }
})




app.listen(PORT, () => console.log('Server running on port ${PORT}'))