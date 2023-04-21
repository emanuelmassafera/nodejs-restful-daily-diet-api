import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should create an user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should create a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    const response = await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    expect(response.statusCode).toEqual(201)
  })

  it('should list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(listMealsResponse.statusCode).toEqual(200)
    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
      }),
    ])
  })

  it('should get a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.statusCode).toEqual(200)
    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
      }),
    )
  })

  it('should delete a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    let listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    const deleteMealResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(deleteMealResponse.statusCode).toEqual(204)

    listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(listMealsResponse.body.meals.length).toEqual(0)
  })

  it('should update a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    const updateMealResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        title: 'Dinner',
        description: 'Rice and beans',
        day: '21/04/2023',
        hour: '21:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    expect(updateMealResponse.statusCode).toEqual(204)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.statusCode).toEqual(200)
    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'Dinner',
        description: 'Rice and beans',
        day: '21/04/2023',
        hour: '21:00',
      }),
    )
  })

  it('should get summary', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Emanuel',
    })
    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Lunch',
        description: 'Rice and chicken',
        day: '21/04/2023',
        hour: '12:00',
        isInsideTheDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        title: 'Dinner',
        description: 'Pizza',
        day: '21/04/2023',
        hour: '20:00',
        isInsideTheDiet: false,
      })
      .set('Cookie', cookies)

    const getSummaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)

    expect(getSummaryResponse.statusCode).toEqual(200)
    expect(getSummaryResponse.body.summary).toEqual({
      totalMeals: 2,
      insideTheDiet: 1,
      offTheDiet: 1,
      bestSequenceInsideTheDiet: 1,
    })
  })
})
