import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkForExistenceOfSessionId } from '../middlewares/check-for-existence-of-session-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        day: z.string(),
        hour: z.string(),
        isInsideTheDiet: z.boolean(),
      })

      const { title, description, day, hour, isInsideTheDiet } =
        createMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      await knex('meals').insert({
        id: randomUUID(),
        title,
        description,
        day,
        hour,
        inside_the_diet: isInsideTheDiet,
        user_id: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where({ user_id: sessionId })
        .select('*')

      return reply.status(200).send({
        meals,
      })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meal = await knex('meals').where({ user_id: sessionId, id }).first()

      return reply.status(200).send({ meal })
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = deleteMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals').where({ user_id: sessionId, id }).delete()

      return reply.status(204).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = updateMealParamsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        day: z.string(),
        hour: z.string(),
        isInsideTheDiet: z.boolean(),
      })
      const { title, description, day, hour, isInsideTheDiet } =
        updateMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      await knex('meals').where({ user_id: sessionId, id }).update({
        title,
        description,
        day,
        hour,
        inside_the_diet: isInsideTheDiet,
      })

      return reply.status(204).send()
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkForExistenceOfSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const totalMeals = Number(
        (await knex('meals').where({ user_id: sessionId }).count())[0][
          'count(*)'
        ],
      )
      const totalMealsInsideTheDiet = Number(
        (
          await knex('meals')
            .where({ user_id: sessionId, inside_the_diet: true })
            .count()
        )[0]['count(*)'],
      )

      let bestSequenceInsideTheDiet = 0
      const sequencesInsideTheDiet = await knex('meals')
        .where({ user_id: sessionId, inside_the_diet: true })
        .groupBy('day')
        .count()

      sequencesInsideTheDiet.forEach((element) => {
        const mealsInsideTheDiet = Number(element['count(*)'])
        if (mealsInsideTheDiet > bestSequenceInsideTheDiet) {
          bestSequenceInsideTheDiet = mealsInsideTheDiet
        }
      })

      return reply.status(200).send({
        summary: {
          totalMeals,
          insideTheDiet: totalMealsInsideTheDiet,
          offTheDiet: totalMeals - totalMealsInsideTheDiet,
          bestSequenceInsideTheDiet,
        },
      })
    },
  )
}
