import { create } from "zustand";
/**
 *         persist
 * - Para que cada vez que cambia algo de la store se realice una accion (en este caso sincronizar con localstorage)
 * - Captura todos los cambios que quieres hacer en la store y 
 * lo sincroniza con localstorage/session storage / con lo que quieras
 */
import { persist } from "zustand/middleware";
import { type Question } from "../types.d";
import confetti from 'canvas-confetti'

interface State {
    questions: Question[],
    currentQuestion: number,
    fetchQuestions: (limit: number) => Promise<void>,
    selectAnswer: (questionId: number, answerIndex: number) => void,
    goNextQuestion: () => void,
    goPreviousQuestion: () => void,
    reset: () => void
}

/**
 * Nota 
 * el parametro de create es un callback que devuelve un objeto que sera 
 * el estado global, aqui se tendra el estado y las formas de
 * actualizar el estado
 * 
 * set: para actualizar el estado
 * get: para leer el estado
 */
export const useQuestionsStore = create<State>()(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0, // posicion del array de questions

        fetchQuestions: async (limit: number) => {
            console.log(import.meta.env.VITE_PUBLIC_X_MASTER_KEY);
            // const res = await fetch('http://localhost:5173/data.json')
            const res = await fetch('https://api.jsonbin.io/v3/b/662a9ed8ad19ca34f85fb920', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': import.meta.env.VITE_PUBLIC_X_MASTER_KEY,
                    'X-Access-Key': '$2a$10$nWVnbgremH0e6lU.Ttu3SuErmjhX3YLQPGoC/wFUjnXipixpcFPRy'
                }
            })
            
            if(!res.ok) throw new Error('Hable con el administrador')

            const json = await res.json()

            const questions = json.record.sort(() => Math.random() - 0.5).slice(0, limit)
            set({ questions })
        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get()
            const newQuestions = structuredClone(questions)

            // obtenemos el indice de la pregunta
            const questionIndex = newQuestions.findIndex(q => q.id === questionId)
            // obtenemos la pregunta
            const questionInfo = newQuestions[questionIndex]
            // revisamos si la respuesta es la correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex
            if (isCorrectUserAnswer) confetti()

            // cambiar la informacion en la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }

            // actualizamos el estado
            set({ questions: newQuestions })
        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get()
            const nextQuestion = currentQuestion + 1

            if (nextQuestion < questions.length) {
                set({ currentQuestion: nextQuestion })
            }
        },

        goPreviousQuestion: () => {
            const { currentQuestion } = get()
            const previousQuestion = currentQuestion - 1

            if (previousQuestion >= 0) {
                set({ currentQuestion: previousQuestion })
            }
        },

        reset: () => {
            set({ currentQuestion: 0, questions: [] })
        }
    }
}, {
    // nombre del persist de este store
    // por defecto lo guarda en localstorage
    name: 'questions'
}))