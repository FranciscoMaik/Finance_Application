import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const verifyTransaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!verifyTransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
