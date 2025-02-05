import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getSortParams from '../utils/getSortParams.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tagFilePath = path.join(__dirname, 'tags.json');

fs.promises.access(tagFilePath)
  .catch(() => fs.promises.writeFile(tagFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default async function listTags(req, res, next) {
  try {
    const { sortBy, sortOrder } = getSortParams(req.query, {
      default: { field: 'name', order: 1 },
      name: { field: 'name', order: 1 },
      quoteCount: { field: 'quoteCount', order: -1 },
      dateAdded: { field: 'dateAdded', order: -1 },
      dateModified: { field: 'dateModified', order: -1 },
    })

    // const results = await Tags.aggregate([
    //   {
    //     $lookup: {
    //       from: 'quotes',
    //       localField: 'name',
    //       foreignField: 'tags',
    //       as: 'quoteCount',
    //     },
    //   },
    //   { $addFields: { quoteCount: { $size: '$quoteCount' } } },
    //   { $sort: { [sortBy]: sortOrder } },
    // ])
    const tagArraydata = await fs.promises.readFile(tagFilePath, 'utf8');
    // tagArraydata.prototype.sort.call(sortBy);

    var ascendingOrder = Array.prototype.sort.call(tagArraydata,sortOrder);//sortBy(tagArraydata, sortOrder);
    const tagArray = JSON.parse(ascendingOrder);
    res.json(tagArray)
  } catch (error) {
    return next(error)
  }
}
