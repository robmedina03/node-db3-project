const Scheme = require('./scheme-model')


const checkSchemeId =  async(req, res, next) => {
  const {scheme_id} = req.params;
  try{
    const schemes = await Scheme.findById(scheme_id);
    if(!schemes){
      res.status(404).json({message:`scheme with scheme_id ${scheme_id} not found`})
    } else{
      req.scheme = schemes
      next()
    }
  }catch(error){
    next(error)
  }

}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const {scheme_name } = req.body;
  if(!scheme_name || typeof scheme_name !== 'string' || scheme_name.trim() === ''){
    res.status(400).json({message: 'invalid scheme_name'})
  }else{
    next()
  }
}
/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const {instructions, step_number} = req.body;
  if(!instructions || typeof instructions !== 'string' || instructions.trim() === ''){
    res.status(400).json({message:'invalid step'})
  }else if (typeof step_number != 'number' || step_number < 1){
    res.status(400).json({message:'invalid step'})
  }else {
    next()
  }

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
