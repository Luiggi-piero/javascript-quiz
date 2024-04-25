import { Container, Stack, Typography } from '@mui/material'
import './App.css'
import { JavaScriptLogo } from './JavaScriptLogo';
import { Start } from './Start';
import { useQuestionsStore } from './store/questions';
import { Game } from './Game';

function App() {

  const questions = useQuestionsStore(state => state.questions)
  // console.log(questions);

  return (
    <>
      <main>
        <Container maxWidth='sm'>

          <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
            <JavaScriptLogo />
            <Typography variant='h2' component='h1'>
              Javascript Quiz
            </Typography>
          </Stack>

          {questions.length === 0 && <Start />}
          {questions.length > 0 && <Game />}

        </Container>
      </main>
    </>
  )
}

export default App

/**
 * Material ui (MUI)
 * npm install @mui/material @emotion/react @emotion/styled
 * npm install @fontsource/roboto @mui/icons-material -E
 * 
 * npm install zustand -E   : manejar estado global
 * 
 * npm i react-syntax-highlighter -E   : para mostrar el codigo como si estuviera en un editor
 * npm i --save-dev @types/react-syntax-highlighter: para el tipo
 * 
 * npm i canvas-confetti -E : confeti
 * npm i --save-dev @types/canvas-confetti
 */