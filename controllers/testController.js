import Test from '../models/Test.js';
import { getAll, createOne } from './handleFactory.js';

export const getAllDocs = getAll(Test);

export const create = createOne(Test);
