import { Box, Button } from '@mui/material';
import type { NextPage } from 'next'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { QuestionData } from '../../lib/types';

const AnswerPage: NextPage<QuestionData> = (props) => {
  const router = useRouter();
  const refBox = useRef<HTMLDivElement>(null);
  const refAnswerBox = useRef<HTMLDivElement>(null);
  const userAnswer = router.query.answer;
  const { id, answer } = props;

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
              <Box fontSize='1.5rem' marginBottom='24px'>正答：{props[answer]}</Box>
              <Box
                display='flex' 
                justifyContent='space-around'
              >
                <Link href={`/question/${nextId}`}><Button variant="outlined">次の問題に挑戦する</Button></Link>
                <Link href='/'><Button variant="outlined">トップへ戻る</Button></Link>
              </Box>
            </>
          ) : (
            <>
              <Box color='blue' marginBottom='24px'>不正解...ざんねん！</Box>
              <Box
                display='flex' 
                justifyContent='space-around'
              >
                <Link href={`/question/${id}`}><Button variant="outlined">もう一度挑戦する</Button></Link>
                <Link href='/'><Button variant="outlined">トップへ戻る</Button></Link>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  </Box>);
}

export const getStaticProps = async (context: any) => {
  const postId = context.params.id;
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

export default AnswerPage