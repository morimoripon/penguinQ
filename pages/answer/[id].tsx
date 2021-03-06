import { Box, Button } from '@mui/material';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import client from '../../lib/client';
import { Params, QuestionData } from '../../lib/types';

type Props = QuestionData & { qlength: number };

const AnswerPage: NextPage<Props> = (props) => {
  const router = useRouter();
  const refBox = useRef<HTMLDivElement>(null);
  const refAnswerBox = useRef<HTMLDivElement>(null);
  const userAnswer = router.query.answer;
  const { id, answer, explanation, qlength } = props;

  useEffect(() => {
    if (refBox && refBox.current && refAnswerBox && refAnswerBox.current) {

      setTimeout(() => {
        if (refBox.current) {
          refBox.current.style.opacity = '1';
        }
      }, 500);


      setTimeout(() => {
        if (refBox.current && refAnswerBox.current) {
          refBox.current.style.display = 'none';
          refAnswerBox.current.style.opacity = '1';
        }
      }, 5000);
    }
  }, [refBox, refAnswerBox]);

  const nextId = id + 1;

  return (<Box width='100vw' height='100vh'>
    <Box 
      width='100%'
      height='100%'
      display='flex' 
      flexDirection='column'
      alignItems='center' 
      justifyContent='center'
      fontFamily="'Hiragino Sans', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, sans-serif" 
    >
      <Box
        fontSize='3rem' 
        sx={{ transition: 'opacity 3s', opacity: '0' }} 
        ref={refBox}
      >
        結果発表
      </Box>
      <Box 
        fontSize='3rem' 
        sx={{ transition: 'opacity 1s', opacity: '0' }} 
        ref={refAnswerBox}
      >
        <Box
          display='flex' 
          flexDirection='column'
          alignItems='center' 
        >
          {userAnswer === answer ? (
            <>
              <Box color='red' marginBottom='24px'>正解！</Box>
              <Box minWidth='200px' maxWidth='600px'>
                <Box fontSize='1.5rem' marginBottom='24px'>正答：{props[answer]}</Box>
                <Box display='flex' fontSize='1rem' color='#777' marginBottom='24px'>
                  <Box flexShrink='0'>解説：</Box>
                  <Box>{explanation}</Box>
                </Box>
              </Box>
              <Box
                display='flex' 
                justifyContent='space-around'
              >
                {qlength < nextId ? (
                  <Link href={'/question/1'}><Button variant='outlined'>初めからやり直す</Button></Link>
                ) : (
                  <Link href={`/question/${nextId}`}><Button variant='outlined'>次の問題に挑戦する</Button></Link>
                )}
                <Link href='/'><Button variant='outlined' sx={{ marginLeft: '8px' }}>トップへ戻る</Button></Link>
              </Box>
            </>
          ) : (
            <>
              <Box color='blue' marginBottom='24px'>不正解...ざんねん！</Box>
              <Box
                display='flex' 
                justifyContent='space-around'
              >
                <Link href={`/question/${id}`}><Button variant='outlined'>もう一度挑戦する</Button></Link>
                <Link href='/'><Button variant='outlined' sx={{ marginLeft: '8px' }}>トップへ戻る</Button></Link>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
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
    props: { id: targetQuestion.number, question: targetQuestion.question, answer: targetQuestion.answer, a: targetQuestion.answer_a, b: targetQuestion.answer_b, c: targetQuestion.answer_c, d: targetQuestion.answer_d, explanation: targetQuestion.explanation, qlength: result.contents.length  }
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default AnswerPage