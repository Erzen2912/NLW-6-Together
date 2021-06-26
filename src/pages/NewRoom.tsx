import { FormEvent, useState } from 'react' 
import { Link, useHistory } from 'react-router-dom'

import illustrasionImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'

import { Button } from '../components/Button'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useTheme } from '../hooks/useTheme'

export function NewRoom(){
  const { user } = useAuth();
  const history = useHistory();
  const { theme , toggleTheme } = useTheme();

  const [newRoom,setNewRoom] = useState('');

  async function handleCreateRoom(event:FormEvent){
    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return(
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrasionImg} alt="Ilustração - perguntas e repostas" />
        <strong>Crie Salas De Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <button onClick={toggleTheme} className="btn">
                {theme === 'dark' ? (
                  'Tema Branco'
                ) : (
                  'Tema Preto'
                )}
          </button>
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom} >
            <input 
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit" className="button">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?<Link  to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}