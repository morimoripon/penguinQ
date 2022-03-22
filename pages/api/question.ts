import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestionData } from '../../lib/types';

const questions: QuestionData[] = [
  {
    id: 1,
    question: '最も体が大きいペンギンはどれ？',
    answer: 'c',
    a: 'アデリーペンギン',
    b: 'イワトビペンギン',
    c: 'コウテイペンギン',
    d: 'フンボルトペンギン'
  },
  {
    id: 2,
    question: 'インド洋の島々にも生息しているペンギンはどれ？',
    answer: 'b',
    a: 'コウテイペンギン',
    b: 'マカロニペンギン',
    c: 'ヒゲペンギン',
    d: 'ジェンツーペンギン'
  }
]

const QuestionHandler = (req: NextApiRequest, res: NextApiResponse<QuestionData[]>) => {
  console.log('req.query', req.query)
  if (Object.prototype.toString.call(req.query) !== '[object Object]' || !Object.keys(req.query).length) {
    console.log('all')
    res.status(200).json(questions);
    return;
  }
  
  const targetQuestion = questions.find(question => question.id === Number(req.query.id));
  if (!targetQuestion) {
    console.log('404だよ')
    res.status(404).json([]);
    return;
  }

  res.status(200).json([ targetQuestion ])
}

export default QuestionHandler