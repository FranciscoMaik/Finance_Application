import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const listTransaction = getCustomRepository(TransactionsRepository)
  const transactions = await listTransaction.find({ relations: ['category_id'] })
  const balance = await listTransaction.getBalance()


  return response.json({ transactions, balance })
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransation = new CreateTransactionService();

  const transaction = await createTransation.execute({
    title,
    type,
    value,
    category
  })

  return response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id })

  return response.status(200).send()

});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
