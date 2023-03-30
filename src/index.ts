import {app} from "./app";
import {runDb} from "./db/db";

const port = 218;
export const start = async () => {
    try {
        await runDb()
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()

module.exports = app
