import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkForExistenceOfSessionId } from '../middlewares/check-for-existence-of-session-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isInsideTheDiet: z.boolean(),
    })

    const { title, description, date, isInsideTheDiet } =
      createMealBodySchema.parse(request.body)

    let { sessionId } = request.cookies
    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      session_id: sessionId,
      title,
      description,
      date,
      inside_the_diet: isInsideTheDiet,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .select('*')

      return reply.status(200).send({
        meals,
      })
    },
  )
}
