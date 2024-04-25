import { Card, List, ListItem, ListItemButton, ListItemText, Stack, Typography, IconButton } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

import { type Question as QuestionType } from "./types.d"
import { useQuestionsStore } from "./store/questions"
import { Footer } from './Footer';

// funcion que se crea una vez
const getBackgroundColor = (info: QuestionType, index: number) => {
    const { userSelectedAnswer, correctAnswer } = info
    // el usuario no selecciono nada todavia
    if (userSelectedAnswer == null) return 'transparent'
    // si ya selecciono, pero la respuesta es incorrecta
    if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
    // si esta es la respuesta correcta
    if (index === correctAnswer) return 'green'
    // si esta es la seleccion de usuario, pero no es correcta
    if (index === userSelectedAnswer) return 'red'

    // si no es ninguna de las anteriores 
    return 'transparent'
}

const Question = ({ info }: { info: QuestionType }) => {

    const selectAnswer = useQuestionsStore(state => state.selectAnswer)

    // funcion que crea otra funcion
    /**
     * 
     * esta parte es el handleClick funcion que responde al click
     * esta el event.target (elemento html)
        () => {
            selectAnswer(info.id, answerIndex)
        }
     */
    const createHandleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
    }

    return (
        <Card variant="outlined" sx={{ bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}>
            <Typography variant="h5">
                {info.question}
            </Typography>

            <SyntaxHighlighter language="javascript" style={atomOneDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{ bgcolor: '#333' }} disablePadding>
                {info.answers.map((answer, index) => (
                    // la key puede ser index, porque no va a cambiar el orden o desapareceran
                    <ListItem key={index} disablePadding divider>
                        <ListItemButton
                            disabled={info.userSelectedAnswer != null}
                            sx={{
                                backgroundColor: getBackgroundColor(info, index)
                            }}
                            onClick={createHandleClick(index)}>
                            <ListItemText primary={answer}></ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export const Game = () => {

    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)

    const questionInfo = questions[currentQuestion]

    return (
        <>
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
                <IconButton
                    onClick={goPreviousQuestion}
                    disabled={currentQuestion === 0}>
                    <ArrowBackIosNew />
                </IconButton>
                {currentQuestion + 1} / {questions.length}
                <IconButton
                    onClick={goNextQuestion}
                    disabled={currentQuestion >= questions.length - 1}>
                    <ArrowForwardIos />
                </IconButton>
            </Stack>
            <Question info={questionInfo} />
            <Footer />
        </>
    )
}