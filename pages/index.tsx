import { Box, Button } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
import client from '../lib/client';
import { QuestionData } from '../lib/types';

type Props = {
  questions: QuestionData[]
}

const Home: NextPage<Props> = ({ questions }) => {
  return (
    <Box
      width='100%'
      height='100%'
      display='flex' 
      flexDirection='column'
      alignItems='center' 
      justifyContent='center'
      fontFamily="'Hiragino Sans', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, sans-serif" 
    >
      <h1>ペンギンクイズ</h1>
      <Box
        display='flex' 
        alignItems='center' 
        justifyContent='space-around'
      >
        {questions.map((question, index) => (
          <Link key={question.id} href={`/question/${question.id}`}>
            <Button variant='outlined' sx={index > 0 ? ({ marginLeft: '8px' }) : {}}>問題{question.id}</Button>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export const getStaticProps = async () => {
  const result = await client.getList({
    endpoint: 'questions',
    queries: { fields: 'number,question,answer,answer_a,answer_b,answer_c,answer_d,explanation' },
  })

  const questions = result.contents.map(question => ({
    id: question.number,
    question: question.question,
    answer: question.answer,
    a: question.answer_a,
    b: question.answer_b,
    c: question.answer_c,
    d: question.answer_d,
    explanation: question.explanation
  }));

  questions.sort((qa, qb) => qa.id - qb.id);

  return {
    props: { questions }
  }
}

export default Home
