import { useQuestionsStore } from "../store/questions"

export const useQuestionsData = () => {
    // Solo saca del estado lo que necesitas ✅
    // ten claro lo que necesitas escuchar ✅
    // se tiene menos renderizados innecesarios ✅
    const questions = useQuestionsStore(state => state.questions)
    
    // observas los cambios que hay en todo el estado 'state'
    // si ocurre algun cambio de algun pedazo de 'state' se vuelve a renderizar el componente
    // const {questions} =useQuestionsStore(state => state)

    let correct = 0
    let incorrect = 0
    let unanswered = 0

    questions.forEach(question => {
        const { userSelectedAnswer, correctAnswer } = question

        if (userSelectedAnswer == null) unanswered++
        else if (userSelectedAnswer == correctAnswer) correct++
        else incorrect++
    })

    return { correct, incorrect, unanswered }
}