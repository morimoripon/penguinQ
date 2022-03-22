import { Box } from '@mui/material';
import type { NextPage } from 'next'
import { AppContextType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Model } from '../../components/Model';
import { QuestionData } from '../../lib/types';

const QuestionPage: NextPage<QuestionData> = ({ id, question, a, b, c, d }) => {
  return (<Box>
    <Header message={question}/>
    <Model 
      pages={{
        a: `/answer/${id}?answer=a`,
        b: `/answer/${id}?answer=b`,
        c: `/answer/${id}?answer=c`,
        d: `/answer/${id}?answer=d`,
      }}
      answer={{ a, b, c, d }}
    />
  </Box>);
}

export const getStaticProps = async (context: any) => {
  const postId = context.params.id // context.params で、paths で指定した params を参照できる
  console.log('postId', postId)
  const response = await fetch(`http://localhost:3000/api/question?id=${postId}`);
  const result = await response.json();

  if (!Array.isArray(result) || !result[0]) return;

  return {
    props: { id: result[0].id, question: result[0].question, answer: result[0].answer, a: result[0].a, b: result[0].b, c: result[0].c, d: result[0].d  }
  }
}

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
    ],
    fallback: false
  }
}

export default QuestionPage