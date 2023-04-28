const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()

const path = require('path')
const app = express()

const PORT = process.env.PORT
const URL = process.env.CONNECTION_URL

app.use(express.json())

app.use(express.static(path.join(__dirname, 'src')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`)
})

mongoose.set('strictQuery', false)

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(URL)
}

const Album = mongoose.model('Albums', new mongoose.Schema({
  album: String,
  artist: String,
  year: Number,
  id: Number
}), 'Albums')

app.get('/api/albums', async (req, res) => {

  try {
    const getAllAlbums = await Album.find()
    res.status(200).json(getAllAlbums)
    console.log('Albums:', getAllAlbums)
  } catch (getAllAlbumsError) {
    res.status(500)
    console.log('Error ', getAllAlbumsError)
  }
})

app.get('/api/albums/:title', async (req, res) => {

  try {
    const search = await Album.findOne({ album: req.params.album })
    if (!search)
      res.status(404).send('Album not found.')
    else
      res.status(200).json(search)
    console.log('Album:', search)
  } catch (searchError) {
    res.status(500).send('Error!')
    console.log('Error ', searchError)
  }
})

app.post('/api/albums', async (req, res) => {
  const { album, artist, year } = req.body
  console.log("New album: ", req.body)

  try {
    const insertError = await Album.findOne({ album: album, artist: artist, year: year })
    if (insertError) {
      res.status(400).send('Album exists!')
      console.log('Album exists!')
    } else {
      const insert = await Album.create({ album: album, artist: artist, year: year })
      res.status(201).json(insert)
      console.log('Inserted album: ', insert)
    }
  } catch (error) {
    res.status(500)
    console.log('Error ', error)
  }
})

app.put('/api/albums/:id', async (req, res) => {
  const { album, artist, year } = req.body

  try {
    const update = await Album.findByIdAndUpdate(req.params.id, { album, artist, year }, { new: true })
    if (!update) {
      res.status(404).send('Album doesn\'t!')
      console.log('Album doesn\'t!')
    } else {
      res.status(200).json(update)
      console.log('Updated album: ', update)
    }
  } catch (error) {
    res.status(500)
    console.log('Error ', error)
  }
})

app.delete('/api/albums/:id', async (req, res) => {

  try {
    const deleteAlbum = await Album.findByIdAndDelete(req.params.id)
    if (!deleteAlbum) {
      res.status(404).send('Album doesn\'t!')
      console.log('Album doesn\'t!')
    } else {
      res.status(200).json(deleteAlbum)
      console.log('Deleted album: ', deleteAlbum)
    }
  } catch (error) {
    res.status(500)
    console.log('Error ', error)
  }
})
