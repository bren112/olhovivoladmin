import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoticiaResumida from "./NoticiaResumida";
import { supabase } from "../supabase/supabase";
import './home.css';

function Home() {
  const [noticias, setNoticias] = useState([]);
  const [titulos, setTitulos] = useState([]);

  useEffect(() => {
    fetchNoticias();
    fetchTitulosNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const { data, error } = await supabase.from("noticias").select("*");
      if (error) {
        throw error;
      }
      setNoticias(data);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error.message);
    }
  };

  const fetchTitulosNoticias = async () => {
    try {
      const { data, error } = await supabase
        .from("noticias")
        .select("id, titulo")
        .order("data_publicacao", { ascending: false });
      if (error) {
        throw error;
      }
      setTitulos(data);
    } catch (error) {
      console.error("Erro ao buscar títulos das notícias:", error.message);
    }
  };

  return (
    <div className="home-container">
      <div className="subtitulo">
        <p id="sub">
         
          {titulos.map((noticia, index) => (
            <span key={noticia.id} id="span">
              {index !== 0 && " | "}
              <Link id="span" to={'/noticias'}>{noticia.titulo}</Link>
            </span>
          ))}
        </p>
      </div>
      <br />
      <h2 id="title">Últimas Notícias</h2>
      <br />

      <div className="noticias-resumidas">
        {noticias.map((noticia) => (
          <NoticiaResumida key={noticia.id} noticia={noticia} />
        ))}
      </div>
    </div>
  );
}

export default Home;
