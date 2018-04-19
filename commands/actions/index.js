const fs = require('fs')
const root = process.cwd()

exports.create = (name) => {
  
  if (fs.existsSync(name))
    console.log(`
(!) Direktori dengan nama ${name} sudah tersedia.
    Cobalah menghapus atau mengganti nama proyek.
    `)
  else {
    fs.mkdir(name, () => {
      console.log('Membuat proyek baru.')
      
      fs.mkdir(`${name}/models`, () => {
        console.log(' (+) Membuat models/')
      })
      
      fs.mkdir(`${name}/views`, () => {
        console.log(' (+) Membuat views/')
        fs.readFile(`${__dirname}/../templates/view.txt`, (err, data) => {
          console.log(' (+) Membuat view/Home')
          data = data.toString().replace(/<name>/g, 'Home')
          fs.writeFileSync(`${name}/views/Home.ejs`, data)
        })
      })

      fs.mkdir(`${name}/public`, () => {
        console.log(' (+) Membuat public/')
      })
      
      fs.mkdir(`${name}/controllers`, () => {
        console.log(' (+) Membuat controllers/')
        fs.readFile(`${__dirname}/../templates/controller.txt`, (err, data) => {
          console.log(' (+) Membuat controllers/Home')
          data = data.toString().replace(/<name>/g, 'Home')
          fs.writeFileSync(`${name}/controllers/Home.js`, data)
        })
      })

      fs.readFile(`${__dirname}/../templates/config.txt`, (err, data) => {
        console.log(' (+) Membuat config.')
        data = data.toString().replace(/(<name>)/g, name)
        fs.writeFileSync(`${name}/ham.config.js`, data)
      })
    })
  }
}

exports.serve = () => {
  if (fs.readdirSync(root).indexOf('ham.config.js') !== -1) {
    const config = require(`${root}/ham.config`)
    const express = require('express')
    const app = require('../../app')

    config.express = express
    config.root = root
    
    app(config)
  } else
    console.log(' (!) Tidak dapat menemukan ham.config.js, bukan proyek HamJS.')
}

exports.generate = (type, name) => {
  if (fs.readdirSync(root).indexOf('ham.config.js') !== -1) {
    if (type === 'controller'){
      if (fs.existsSync(`${root}/controllers/${name}.js`)) {
        console.log(` (!) Sudah ada controller bernama ${name}.`)
      } else {
        console.log(` (+) Membuat controller ${name}`)
        fs.readFile(`${__dirname}/../templates/controller.txt`, (err, data) => {
          data = data.toString().replace(/<name>/g, name)
          fs.writeFileSync(`${root}/controllers/${name}.js`, data)
        })
      }
    } else if (type === 'model') {
      if (fs.existsSync(`${root}/models/${name}.js`)) {
        console.log(` (!) Sudah ada model bernama ${name}.`)
      } else {
        console.log(` (+) Membuat model ${name}`)
        fs.readFile(`${__dirname}/../templates/model.txt`, (err, data) => {
          data = data.toString().replace(/<name>/g, name)
          fs.writeFileSync(`${root}/models/${name}.js`, data)
        })
      }
    }
  } else
    console.log(' (!) Tidak dapat menemukan ham.config.js, bukan proyek HamJS.')
}