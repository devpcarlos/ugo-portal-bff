const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000;

app.use(express.json())

const apiUgo = axios.create({
    baseURL: 'http://localhost:8080'
})

app.get('/', (req, res) => {
    res.send('Servidor para login activo')
})

app.listen(PORT, () => {
    console.log(`El login esta en el puerto ${PORT}`)
})

async function postLogin(data) {

    const headers = {
        email: data.email,
        password: data.password,
        captcha: data.captcha
    }
    try {
        const response = await apiUgo.post('/auth/login', null, {headers});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.post('/login', async (req, res) => {
    const {email, password, captcha} = req.headers;

    try {
        const response = await postLogin({email, password, captcha});
        res.json(response);
    } catch (error) {
        res.status(401).json({message: 'Error al iniciar sesión', error: error.message}).end();
    }
})

// Aqui tenemos una funcion que guarda la informacion sobre la experiencias
async function RegisterExperience(experienceData, token) {

    try {
        const response = await apiUgo.post('/experience/create',
            experienceData,{
            headers: {
                'Authorization': token
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.post('/create', async (req, res)=>{
    const {authorization} = req.headers;
    const experienceData = req.body;

    try{
        const response = await RegisterExperience (experienceData,authorization);
        res.json(response);
    }catch (error) {
        res.status(401).json({message:'Usuario no autorizado',
            error: error.message}).end();
    }
})

// Aqui tenemos una funcion para listar la informacion sobre la experiencias
async function ListExperience (token){
    try {
        const response = await apiUgo.get('/experience', {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    }catch (error) {
        throw error
    }
}

app.get('/experience',async (req, res)=>{
    const {authorization} = req.headers;
    try {
        const  response = await ListExperience(authorization);
        res.json(response)
    }catch (error) {
        res.status(401).json({message:'Usuario no autorizado',
            error: error.message}).end();
    }
})