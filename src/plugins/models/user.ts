import { Collection } from 'mongodb'

export
class UserModel {
    private user: Collection

    constructor (user: Collection) {
      this.user = user
    }

    async findUser (email: string): Promise<null|{
      _id: string;
      role: string;
      name: string;
      email: string;
      password: string;
    }> {
      try {
        const user = await this.user.findOne({ email })
        return user
      } catch (err) {
        return null
      }
    }

    async insertOne (
      name: string,
      email: string,
      password: string,
      role: string
    ): Promise<boolean> {
      try {
        const insert = await this.user.insertOne({
          name,
          email,
          password,
          role
        })
        if (insert.insertedCount === 1) {
          return true
        }
        return false
      } catch (err) {
        return false
      }
    }
}
