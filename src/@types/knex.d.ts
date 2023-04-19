// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      session_id: string
      title: string
      description: string
      date: Date
      inside_the_diet: boolean
    }
  }
}
