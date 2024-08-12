import "./App.css";
import Portfolio from "./components/Portfolio.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Portfolio />
    </div>
  );
}

export default App;
