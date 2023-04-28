const updateInfo = document.getElementById('updateInfo')
const addInfo = document.getElementById('addInfo')

displayAlbums()

async function displayAlbums() {
  let fetchedFromDb = [{}]

  try {
    let response = await fetch('api/albums', {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    })

    fetchedFromDb = await response.json()

  } catch (error) {
    console.log(error)
  }

  let htmlArray = fetchedFromDb.map(album => {
    return /*html*/`
     <div class="album">
              <p><span><b>Album: </b></span>${album.album}</p>
              <p><span><b>Artist: </b></span>${album.artist}</p>
              <p><span><b>Year: </b></span>${album.year}</p>
              <button class="update-button" onclick="addUpdateFields('${album._id}', '${album.album}', '${album.artist}', '${album.year}')">Update</button>
              <button class="delete-button" onclick="deleteAlbum('${album._id}')">Delete</button>
            </div>
          `
  })
  document.getElementById("albums").innerHTML = htmlArray.join('')
}

async function deleteAlbum(id) {
  try {
    let response = await fetch('/api/albums/' + id, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' }
    })

    let info = response.json()
    displayAlbums()
    return (info)

  } catch (error) {
    console.log(error)
  }
}

addInfo.addEventListener('click', async () => {
  const album = albumName.value.trim()
  const artist = artistName.value.trim()
  const year = yearMade.value.trim()

  if (!album || !artist || !year || isNaN(year)) {
    console.log('Please enter info in all boxes.')
    return
  }

  const info = { album, artist, year }

  try {
    const result = await fetch('api/albums', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: { 'Content-Type': 'application/json' }
    })
    const response = await result.json()
    console.log(response)
    displayAlbums()
    albumName.value = ''
    artistName.value = ''
    yearMade.value = ''
  } catch (error) {
    console.error(error)
  }
})

function addUpdateFields(id, album, artist, year) {

  let updateID = id

  updateInfo.innerHTML = /*html*/`
  <label>Album</label>
  <input type="text" id="albumUpdate">
  <label>Artist</label>
  <input type="text" id="artistUpdate">
  <label>Year</label>
  <input type="text" id="yearUpdate">
  <button class="update-button" type="button" id="update-button">Update album</button>`

  document.getElementById("albumUpdate").value = album
  document.getElementById("artistUpdate").value = artist
  document.getElementById("yearUpdate").value = year

  updateData = document.getElementById("update-button")

  updateData.addEventListener('click', async () => {

    let album = albumUpdate.value
    let artist = artistUpdate.value
    let year = yearUpdate.value

    let info = { album, artist, year }

    if (!album || !artist || !year || isNaN(year))
      console.log('Please enter info in all boxes.')
    else {

      try {
        const result = await fetch('api/albums/' + updateID, {
          method: 'PUT',
          body: JSON.stringify(info),
          headers: { 'content-type': 'application/json' }
        })

        const response = await result.json()
        displayAlbums()
        updateInfo.innerHTML = ''
        console.log(response)

      } catch (error) {
        console.log(error)
      }
    }
  })
}
