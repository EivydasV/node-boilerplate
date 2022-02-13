const filterObject = (obj: any, ...allowedFields: string[]) => {
  const newObject: any = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el]
  })
  return newObject
}
export default filterObject
