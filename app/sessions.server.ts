import {createSessionStorage} from "remix"

import {db} from "~/util/prisma.server"

const {getSession, commitSession, destroySession} = createSessionStorage({
  cookie: {
    name: `session`,

    httpOnly: true,
    sameSite: `lax`,
    secrets: [process.env.COOKIE_SECRET!],
    secure: true,
  },
  async createData(data) {
    const string = JSON.stringify(data)
    const {id} = await db.sessionData.create({data: {data: string}})
    return id
  },
  async readData(id) {
    const res = await db.sessionData.findUnique({where: {id}})
    if (!res) return null
    return JSON.parse(res.data)
  },
  async updateData(id, data) {
    const string = JSON.stringify(data)
    await db.sessionData.update({where: {id}, data: {data: string}})
  },
  async deleteData(id) {
    await db.sessionData.delete({where: {id}})
  },
})

export {getSession, commitSession, destroySession}
