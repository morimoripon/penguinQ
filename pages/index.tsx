import { Box, Button } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
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
        {questions.map(question => (
          <Link key={question.id} href={`/question/${question.id}`}>
            <Button variant="outlined">問題{question.id}</Button>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export const getStaticProps = async () => {
  const response = await fetch(`http://localhost:3000/api/question`);
  const result = await response.json();

  if (!Array.isArray(result)) return;

  return {
    props: { questions: result }
  }
}

export default Home
