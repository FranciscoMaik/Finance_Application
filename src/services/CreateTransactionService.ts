import AppError from '../errors/AppError';
import { getRepository } from 'typeorm'

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: "outcome" | "income";
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transitionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);
    var existId = '';

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type of Transaction invalid.', 403)
    }

    const checkCategory = await categoriesRepository.findOne({
      where: { title: category }
    })

    if (checkCategory) {
      existId = checkCategory.id
    } else {

      const categoryCreate = categoriesRepository.create({
        title: category,
      })

      const categorySave = await categoriesRepository.save(categoryCreate)
      existId = categorySave.id;
    }


    const transactionCreate = transitionsRepository.create({
      title,
      value,
      type,
      category_id: existId
    })

    const transaction = await transitionsRepository.save(transactionCreate)

    return transaction;
  }
}

export default CreateTransactionService;
