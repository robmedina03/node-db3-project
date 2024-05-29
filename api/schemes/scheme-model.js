const db = require('../../data/db-config')

function find() { 
  return db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
  .groupBy('sc.scheme_id')
  .select('sc.scheme_id', 'sc.scheme_name',
    db.raw('COUNT(st.step_id) as number_of_steps' )
  )
 
}





const findById = async (scheme_id) => {

  const scheme= await  db('schemes').where({scheme_id}).first()
  if(!scheme) return null

  const steps = await db('steps').where({scheme_id}).orderBy('step_number')

  return {
    ...scheme,
    steps
  }
  
  
  // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

const findSteps = async(scheme_id) => {

  const steps = await db('steps')
  .join('schemes', 'steps.scheme_id', 'schemes.scheme_id')
  .select('steps.step_id','steps.step_number', 'steps.instructions', 'schemes.scheme_name')
  .where('steps.scheme_id', scheme_id)
  .orderBy('steps.step_number')
  return steps



  
  
  // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

const add= async(scheme) => { 

  try{
      const [newSchemeId] = await db('schemes').insert(scheme)
      return findById(newSchemeId)
  }catch (error){
    console.error('Error inserting scheme', error)
    throw error
  }


}

function addStep(scheme_id, step) { 

  return db('steps')
  .insert({...step, scheme_id})
  .then(() => findSteps(scheme_id))
  
  
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
