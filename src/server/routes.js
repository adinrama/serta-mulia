const postPredictHandler = require('../server/handler')

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        // Mengizinkan input data berupa gambar
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  }
]

module.exports = routes
