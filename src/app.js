const express = require("express")
const ProductManager = require("./product-manager.js")
const app = express()

const PUERTO = 8080
const fileDir= "src/ejemplo.json"
const primerManejador = new ProductManager(fileDir)

app.get("/productos", async(req, res)=>{
    const limit = req.query.limit
    try {
        const products = await primerManejador.getProducts()
        if (limit) {
            const cutedArray = products.slice(0, +limit)
            res.send(cutedArray)
        }   
        else res.send(products)
    } catch (error) {
        console.log("Hubo un error",error)
    }
})

app.get("/productos/:pid", async(req, res)=>{
    const productId = req.params.pid
    try {
        const products = await primerManejador.getProducts()
        const productFounded = products.filter(p => p.id == productId)
        if (productFounded.length) {
            res.send(productFounded)
        } else {
            res.status(404).send("No existe un producto con ese id")
        }
    } catch (error) {
        console.log("Hubo un error",error)
    }
})

//El listen siempre deberia ir abajo de todoo
app.listen(PUERTO, ()=> {
    console.log(`Escuchando en el puerto: http://localhost:${PUERTO}`)
})