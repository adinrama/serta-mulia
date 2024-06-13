require('dotenv').config()

const Hapi = require('@hapi/hapi')
const routes = require('../server/routes')
const loadModel = require('../services/loadModel')

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  const model = await loadModel()
  server.app.model = model

  server.route(routes)

  server.ext('onPreResponse', function (request, h) {
    // Simpan segala response dari setiap request pengguna ke variabel 'response'
    const response = request.response

    // Penanganan error jika terjadi kesalahan input (Input Error)
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: `${response.message} Silakan gunakan foto lain.`
      })
      newResponse.code(response.statusCode)
      return newResponse
    }

    // Penanganan error jika terjadi kesalahan pada server (Server Error)
    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      })
      newResponse.code(response.statusCode)
      return newResponse
    }

    // Program akan melanjutkan eksekusinya jika tidak terdapat error
    return h.continue
  })

  await server.start()
  console.log(`Server start at: ${server.info.uri}`)
}

init()
