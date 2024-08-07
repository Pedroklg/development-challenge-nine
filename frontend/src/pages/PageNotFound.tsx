import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Pagina Não encontrada!</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => navigate('/')}
      >
        Ir para o Inicio
      </button>
    </div>
  );
};

export default PageNotFound;