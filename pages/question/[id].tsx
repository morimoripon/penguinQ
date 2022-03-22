import { Box } from '@mui/material';
import type { NextPage } from 'next'
import { AppContextType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Model } from '../../components/Model';
import client from '../../lib/client';
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
  const contentId = context.params?.id;
  if (typeof contentId !== 'string') {
    throw new Error('contentIdがありません');
  }

  const result = await client.getList({
    endpoint: 'questions',
    queries: { fields: 'number,question,answer,answer_a,answer_b,answer_c,answer_d' },
  })

  if (!Array.isArray(result.contents)) {
    throw new Error('contentIdに対応するデータがありません');
  } 

  const targetQuestion = result.contents.find((question: any) => question && question.number === Number(contentId));

  return {
    props: { id: targetQuestion.number, question: targetQuestion.question, answer: targetQuestion.answer, a: targetQuestion.answer_a, b: targetQuestion.answer_b, c: targetQuestion.answer_c, d: targetQuestion.answer_d  }
  }
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default QuestionPage