import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestionData } from '../../lib/types';
import { questions } from './data/questions';

const QuestionHandler = (req: NextApiRequest, res: NextApiResponse<QuestionData[]>) => {
  console.log('req.query', req.query)
  if (Object.prototype.toString.call(req.query) !== '[object Object]' || !Object.keys(req.query).length) {
    res.status(200).json(questions);
    return;
  }
  
  const targetQuestion = questions.find(question => question.id === Number(req.query.id));
  if (!targetQuestion) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json([ targetQuestion ])
}

export default QuestionHandler