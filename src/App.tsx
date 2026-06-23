import './App.css'
import KanbanBoard from './components/KanbanBoard' 
import Background from './components/BackGround'

function App() {
  return (
    <Background>
      <KanbanBoard />
    </Background>
  );
}

export default App