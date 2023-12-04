const fs = require("fs")
const path = require("path")
require('dotenv').config();
var googleTranslate = require('google-translate')(process.env.GTS_API);


//const langsToTranslate = ["en", "de", "ru", "es", "it", "fr"]
const langsToTranslate = [ "ru", "es", "it", "fr"]

const convert = async () => {
    let file = process.argv[2]
    let language = process.argv[3]
    if (!file || !language) {
        console.log("write [file] [lang] parameters")
        process.exit()
    }

    const folder = path.dirname(file)
    const json = await JSON.parse(fs.readFileSync(file, "utf-8"))
    let keys = Object.keys(json)

    await Promise.all(langsToTranslate.map(async (l) => {
        let langfile = `${l}.json`
        let translated = {}
        await Promise.all(keys.map(async (key) => {
            try {
                await new Promise((resolve) => {
                    googleTranslate.translate(json[key], l, function (err, translation) {
                        let word = translation.translatedText
                        console.log("word:", word)
                        translated[key] = word
                        return resolve(word)
                    })
                })
            } catch (error) {
                console.log("error", error)
            }
        }))
        console.log(translated)
        fs.writeFileSync(path.join(folder, langfile), JSON.stringify(translated))
    }))

}
convert()
