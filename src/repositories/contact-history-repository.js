export const getAllByApplicationReference = async (db, applicationReference, collection) => {
  return db.collection(collection).findOne(
    { reference: applicationReference },
    {
      projection: { _id: 0, contactHistory: 1 }
    }
  )
}

export const updateApplicationValuesAndContactHistory = async ({
  db,
  reference,
  updatedPropertyPathsAndValues,
  contactHistory,
  user,
  updatedAt,
  collection
}) => {
  return db.collection(collection).findOneAndUpdate(
    { reference },
    {
      $set: {
        ...updatedPropertyPathsAndValues,
        updatedAt,
        updatedBy: user
      },
      $push: {
        contactHistory: {
          $each: contactHistory
        }
      }
    },
    { returnDocument: 'after' }
  )
}
