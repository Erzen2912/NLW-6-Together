
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button , } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory()
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title , questions } = useRoom(roomId); //useRoom é um hook que ajuda para não ficar copiando e colando código

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt:new Date()
    })
    
    history.push('/')
  }

  async function handleDeleteQuestion(questionId:string){
    if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
       await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId:string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered:true
    })
  }

  async function handleHighlightQuestion(questionId:string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted:true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} /> {/* Código da Sala */}
            <Button 
              isOutlined
              onClick={handleEndRoom} /* Função para encerrar a room */
            >Encerrar Sala</Button> 
          </div>
        </div>
      </header>

      <main>
        <div className="room-title"> 
          <h1>Sala {title}</h1> {/* Nome da Sala */}
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> } {/* Quantas perguntas tem na Sala */}
        </div>
        <div className="question-list">
          {questions.map(question => {
            return(
              <Question 
                key={question.id} 
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              > 
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)} /* Função para deletar a(s) questões  */
                    >
                      <img src={checkImg} alt="Deletar pergunta" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)} /* Função para deletar a(s) questões  */
                    >
                      <img src={answerImg} alt="Deletar pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)} /* Função para deletar a(s) questões  */
                >
                  <img src={deleteImg} alt="Deletar pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}