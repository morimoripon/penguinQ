import { Box } from '@mui/material';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { AppContextType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Model } from '../../components/Model';
import client from '../../lib/client';
import { Params, QuestionData } from '../../lib/types';

type Props = QuestionData;

const QuestionPage: NextPage<Props> = ({ id, question, a, b, c, d }) => {
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

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const contentId = context.params?.id;
  if (typeof contentId !== 'string') {
    throw new Error('contentIdがありません');
  }

  const result = await client.getList({
    endpoint: 'questions',
    queries: { fields: 'number,question,answer,answer_a,answer_b,answer_c,answer_d,explanation' },
  })

  if (!Array.isArray(result.contents)) {
    throw new Error('データがありません');
  } 

  const targetQuestion = result.contents.find((question: any) => question && question.number === Number(contentId));

  if (!targetQuestion) {
    throw new Error('contentIdに対応するデータがありません');
  } 

  return {
    props: { id: targetQuestion.number, question: targetQuestion.question, answer: targetQuestion.answer, a: targetQuestion.answer_a, b: targetQuestion.answer_b, c: targetQuestion.answer_c, d: targetQuestion.answer_d, explanation: targetQuestion.explanation  }
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default QuestionPage