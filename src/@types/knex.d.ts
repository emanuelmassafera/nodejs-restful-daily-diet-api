// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
    }

    meals: {
      id: string
      title: string
      description: string
      day: string
      hour: string
      inside_the_diet: boolean
      user_id: string
    }
  }
}
