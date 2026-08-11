import { APPLICATION_COLLECTION, OW_APPLICATION_COLLECTION } from '../constants/index.js'

export const getAllFlags = async (db) => {
  return db
    .collection(APPLICATION_COLLECTION)
    .aggregate([
      { $unwind: '$flags' },
      { $match: { 'flags.deleted': { $ne: true } } },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$flags',
              {
                applicationReference: '$reference',
                sbi: '$organisation.sbi'
              }
            ]
          }
        }
      },
      {
        $unionWith: {
          coll: OW_APPLICATION_COLLECTION,
          pipeline: [
            { $unwind: '$flags' },
            { $match: { 'flags.deleted': { $ne: true } } },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    '$flags',
                    {
                      applicationReference: '$reference',
                      sbi: '$organisation.sbi'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    ])
    .toArray()
}
